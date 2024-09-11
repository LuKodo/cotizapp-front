export const formatter = (value: number) => {
  let val = value.toString().replace(/[^0-9\.]+/g, '');
  val = val.split('.')[0]
  val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return "$ " + val
}

export const unformatter = (value: string) => {
  let val = value.toString().replace(/[^0-9\.]+/g, '');
  val = val.split('.')[0]
  return val
}
