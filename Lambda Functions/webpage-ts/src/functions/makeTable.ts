import { ItemList } from "aws-sdk/clients/dynamodb";

export function makeTable(myArray: ItemList) {

    let s: string = "";

    myArray.forEach(item => {

        let phoneNumber: String = item["phoneNumber"] as String ?? "";
        phoneNumber = phoneNumber.substring(0, phoneNumber.length-5) + "XXXXX";

        let recordDate: Date = new Date(item["recordDate"] as number ?? 0);
        
        s += "  <tr>"
        s += "    <th>" + phoneNumber + "</th>"
        s += "    <th>" + recordDate.toISOString() + "</th>"
        s += "    <th>" + item["vanityNumbers"] + "</th>"
        s += "  </tr>"
        
        console.log(item);
    });
    
    return s;
}