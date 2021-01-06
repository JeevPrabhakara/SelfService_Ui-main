export function intToString(value) {
    if (new String(value).length > 3) {
        var suffixes = ["", "K", "M", "B", "T"];
        var suffixNum = Math.floor(("" + value).length / 3);
        var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
        if (shortValue % 1 != 0) {
            var shortNum = shortValue.toFixed(1);
        }
        // return shortValue.toFixed(2) + suffixes[suffixNum];
        return (Math.round((shortValue + Number.EPSILON) * 100)/100)  + suffixes[suffixNum];
    } else
        return value;
}

export function getRiskScoreColor(riskScore: number) {
    if (riskScore <= 65)
        return 'limegreen';
    else if (riskScore > 65 && riskScore <= 79)
        return 'darkorange';
    else
        return 'crimson';
}

export class User {
    public entityId: string;
    public fName: string;
    public lName: string;
    public lastgenerationtime: number;
    public riskscorebygrp: number;
}


export function getUniqueObjectsInArray(arr, comp) {

    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}

export function scoreRounder(value: any) {
    return Math.round(<number>value);
}