
export function UserActions({actions}){

    console.log(actions)

    return <table border="1" className="data-table">
        <thead>
            <tr>
                <th>Time</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {actions.map(action=>{
                const timeString=getTimeString(action.time)
                return <tr key={action.time}>
                    <td>{timeString}</td>
                    <td>{action.msg}</td>
                </tr>
            })}
        </tbody>
    </table>
}

function getTimeString(time){
    const diff = Date.now()-time
    const seconds = Math.floor(diff/1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days>1) return `${days} days ago`
    else if (days===1) return 'Yesterday'
    else if (hours >= 1) return `${hours} hours ago`
    else if (minutes> 2) return  `${minutes} minutes ago`
    else return 'Now'
}