export function vanityGenerator(baseString: string, remainingDigits: string, vanityWordList: string[]): void {

    let activeDigit = remainingDigits.substring(0, 1);
    const numberLetters = [
        "",     // 0
        "",     // 1
        "ABC",  // 2
        "DEF",  // 3
        "GHI",  // 4
        "JKL",  // 5
        "MNO",  // 6
        "PQRS", // 7
        "TUV",  // 8
        "WXYZ"  // 9
    ];

    for (let i = 0; i < numberLetters[activeDigit].length; i++) {
        if (remainingDigits.length > 1) {
            vanityGenerator(
                baseString + numberLetters[activeDigit][i],
                remainingDigits.substring(1, remainingDigits.length + 1),
                vanityWordList
            );
        }
        else {
            vanityWordList.push(baseString + numberLetters[activeDigit][i]);
        }
    }
}