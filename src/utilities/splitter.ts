const e = module.exports
e.splitter = async(message: string): Promise<Array<Array<string>>> => {

  var rows = message.toString().split("\n")


  var limit = rows[0].split(" ")
  rows.splice(0, 1)

  var data = rows.slice((Number(limit[0]) - 1), Number(limit[1]))

  var dataSplit = []
  for (let i = 0; i < data.length; i++) {
    var [str1, str2, ...str3] = data[i].split(" ")
    var str3Join = str3.join(" ")
    dataSplit[i] = [str1, str2, str3Join]
  }

  return dataSplit as Array<Array<string>>
}
