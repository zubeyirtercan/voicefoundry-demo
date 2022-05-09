import { ItemList } from "aws-sdk/clients/dynamodb";

export function makeTable(myArray: ItemList) {

    let s: string = "";

    myArray.forEach(item => {
        
        s += "  <tr>"
        s += "    <th>" + item["phoneNumber"] + "</th>"
        s += "    <th>" + item["recordDate"] + "</th>"
        s += "    <th>" + item["vanityNumbers"] + "</th>"
        s += "  </tr>"
        
        console.log(item);
    });
    
    return s;
}