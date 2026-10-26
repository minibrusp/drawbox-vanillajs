const filenameFormat = (name) => {
  const timestamp = Date.now()
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getUTCDate()
  const time = date.getTime()

  return `${name}-${month}${day}${year}${time}.png`
}


export default filenameFormat