module.exports = (uploadToGalleryList, updateList) => {
    const accInDB = Array.from(new Set(uploadToGalleryList.map((item) => item.accountId)));
    console.log('accInDB: ', accInDB.length);
    const accInList = Array.from(new Set(updateList.map((item) => item.accountId)));
    console.log('accInList: ', accInList.length);

    accInList.forEach((al) => {
        if (!accInDB.includes(al)) {
            console.log(al);
        }
    });
};
