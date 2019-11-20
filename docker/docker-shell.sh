#!/usr/bin/env bash

TEST_MODE=test
DEBUGTEST_MODE=debugtest
JENKINSBUILD_MODE=jenkinsbuild
MODE=$TEST_MODE

#parse argument list
while [[ $# > 0 ]]
do
	ARG=$1

	case $ARG in
	-t|--test) MODE=$TEST_MODE ;;
	-dt|--debugtest) MODE=$DEBUGTEST_MODE ;;
	-j|--jenkintest) MODE=$JENKINSBUILD_MODE ;;
	esac

	shift
done

#set pwd
cd /opt/app/current

#echo out environment variables we care about
echo APPLICATION_VARIABLES
echo NODE_ENV=$NODE_ENV

waitOnResources()
{
	#check for port on rabbit box
	while ! nc -z rabbitbox 5672; do
		sleep 1
		echo WAITING FOR rabbitbox:5672
	done

	#check for port on pg box
	while ! nc -z pgbox 5432; do
		sleep 1
		echo WAITING FOR pgbox:5432
	done

    #check for yellow/green status when es cluster consist of only a single box
	ES=$(curl -s "esbox:9200/_cat/health?h=status" | tr -d '[:space:]')
	while [[ "green" != $ES && "yellow" != $ES ]]; do
		sleep 1
		echo WAITING FOR esbox:9200 status: $ES
		ES=$(curl -s "esbox:9200/_cat/health?h=status" | tr -d '[:space:]')
	done
}

#execution based on argument
if [ $MODE == $TEST_MODE ]; then
	waitOnResources
	echo RUNNING TEST
	make test
elif [ $MODE == $DEBUGTEST_MODE ]; then
	waitOnResources
	echo RUNNING DEBUG BUILD
	make debug-test
elif [ $MODE == $JENKINSBUILD_MODE ]; then
	waitOnResources
	echo RUNNING JENKINS BUILD
	make jenkins-build
fi