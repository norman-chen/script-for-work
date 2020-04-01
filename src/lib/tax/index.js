const fa = require('./tax.json');

const printNar = (nar) => {
    console.log(`pref_label: ${nar.pref_label} ; status: ${nar.status}`)
    if (nar.narrower.length) {
        nar.narrower.forEach(n => printNar(n))
    }
}

(() => {
    const beauty = fa.data.find(d => d.code === 'BWP')
    // console.dir(beauty.facets.length, {depth: 100})
    for (let i = 0; i < beauty.facets.length; i++) {
        console.log(beauty.facets[i].label)
        beauty.facets[i].narrower.forEach(nar => printNar(nar));
    }

})()