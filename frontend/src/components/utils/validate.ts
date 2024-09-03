export const validate = async (checkIn: any[], data: { [x: string]: any; }) => {
    let result:any = {};
    checkIn.forEach((itm: { validate: string; field: string; name: string; }) => {
     let toBeChecked = itm.validate.split('|')
      toBeChecked.forEach((check: string) => {
        if (check == 'required') {
          if (!(itm.field in data) || (data[itm.field]) == null || (data[itm.field]).toString().trim() == "") {
            result[itm.field] = itm.name + ' is required'
          }
        }
      })
    });
    if (Object.keys(result).length !== 0) {
      throw result
    }
    return true
}
