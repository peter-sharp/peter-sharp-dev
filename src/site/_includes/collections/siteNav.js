module.exports = function siteNavCollection(collection) {
    return collection.getFilteredByTag('page').sort(function(a, b) {
        return b.data.menuIndex - a.data.menuIndex
    })
}
