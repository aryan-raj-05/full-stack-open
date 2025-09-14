const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const className = notification.isError
    ? 'error'
    : 'notify'

  return (
    <div className={className}>
      {notification.message}
    </div>
  )
}


export default Notification