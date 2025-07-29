const Notification = ({ notification }) => {
    if (notification === null) {
        return null
    }

    const msgStyle = notification.type === 'fail'
        ? { color: 'red', background: 'lightcoral'}
        : null

    return (
        <div className="notification" style={msgStyle}>
            {notification.message}
        </div>
    )
}

export default Notification