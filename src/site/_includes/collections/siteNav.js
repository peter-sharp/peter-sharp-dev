module.exports = function siteNavCollection(collection) {
    const items = collection.getFilteredByTag('page').slice();
    
    return items.sort(function(a, b) {
        return b.data.menuIndex - a.data.menuIndex
    }).reverse();
}
