import moment from 'moment'

// args are timestamp
export const timeDistance = (start, end, format = 'mm:ss') => {
  const now = moment()
  const a = Math.abs(moment(start).diff(now))
  const b = Math.abs(moment(end).diff(now))
  const max = Math.abs(moment(start).diff(moment(end)))

  return {
      expired: a >= max
    , percent: 100-parseInt((a*100)/(a+b), 10)
    , time_elapsed: moment("1900-01-01 00:00:00").add(a, 'ms').format(format)
    , time_left: moment("1900-01-01 00:00:00").add(b, 'ms').format(format)
  }
}