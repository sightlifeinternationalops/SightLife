if (dataType == "percent") {
    if (actualExists) {
        actual = Math.round(actual / actualsCounter )
        actual += "%"
    }
    if (targetExists) {
        target = Math.round(target / targetsCounter )
        target += "%"
    }
    color = this.actualColor(actual, target, monthObjColor.dataType)

} else if (dataType == "money") {
    color = this.actualColor(actual, target, monthObjColor.dataType)
    if (actualExists) {
        actual = "$" + actual 
    }
    if (targetExists) {
        target = "$" + target
    }
} else {
    color = this.actualColor(actual, target, dataType)
}