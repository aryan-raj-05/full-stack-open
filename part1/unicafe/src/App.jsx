import { useState } from 'react'

const Heading = ({ text }) => <h2>{text}</h2>
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const DisplayStats = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  
  if (total === 0) {
    return (
      <>
        <div>No feedback given</div>
      </>
    )
  }

  const avg = (good - bad) / total
  const percent = (good / total) * 100
  return (
    <table>
      <tbody>
        <StatisticLine text='good'      value={good}/>
        <StatisticLine text='neutral'   value={neutral}/>
        <StatisticLine text='bad'       value={bad}/>
        <StatisticLine text='all'       value={total}/>
        <StatisticLine text='average'   value={avg}/>
        <StatisticLine text='positive'  value={percent}/>
      </tbody>
    </table>
  )
}

const Statistics = (props) => {
  return (
    <>
      <Heading text='statistics'/>
      <DisplayStats good={props.good} neutral={props.neutral} bad={props.bad}/>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Heading text='give feedback'/>
      <Button onClick={handleGoodClick} text={'good'}/>
      <Button onClick={handleNeutralClick} text={'neutral'}/>
      <Button onClick={handleBadClick} text={'bad'}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App