var pinyin = require('pinyin');

var custom_data = {
    "蔺立萱": "lin4 li4 xuan1",
    "雒洛": "luo4 luo4",
    "靳健": "jin1 jian4",
    "闫婷钰": "yan2 tin2 yu4",
    "郝亦雯": "hao3 yi4 wen2"
}

function getPY(str) {
    if (str in custom_data) return custom_data[str];
    return pinyin(str, {
        style: pinyin.STYLE_TONE2
    }).toString();
}

function sortByKeyName(list, key) {
    list.sort(function (a, b) {
        return getPY(a[key]).localeCompare(getPY(b[key])); 
    });
    return list;
}

module.exports = sortByKeyName;