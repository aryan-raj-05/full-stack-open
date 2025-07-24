import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const MostVotes = ({ anecdotes, votes, index }) => {
  console.log('votes are: ', votes.join(' '))
  return (
    <>
      <h1>Anecdote with the most votes</h1>
      <div>{anecdotes[index]}</div>
      <div>has {votes[index]} votes</div>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const handleNextClick = () => {
    const index = Math.floor(Math.random() * (anecdotes.length))
    console.log('next index is', index)
    setSelected(index)
  }

  const handleVotes = (index) => {
    const copy = [...votes]
    copy[index] += 1
    setVotes(copy)
  }

  const getMaxVotesIndex = () => {
    let max = 0
    for (let i = 0; i < votes.length; i++) {
      if (votes.at(i) > votes.at(max)) max = i
    }
    return max
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <Button onClick={() => handleVotes(selected)} text='vote'/>
      <Button onClick={handleNextClick} text='next anecdote'/>
      <MostVotes anecdotes={anecdotes} votes={votes} index={getMaxVotesIndex()}/>
    </div>
  )
}

export default App