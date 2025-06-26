const Header = (props) => {
  console.log(props);
  return (
    <>
      <h1>{props.name}</h1>
    </>
  )
}

const Part = (props) => {
  console.log(props);
  return (
    <>
      <p>{props.name} {props.exer}</p>
    </>
  )
}

const Content = (props) => {
  console.log(props);
  return (
    <>
      <Part name={props.part[0]} exer={props.exercise[0]}/>
      <Part name={props.part[1]} exer={props.exercise[1]}/>
      <Part name={props.part[2]} exer={props.exercise[2]}/>
    </>
  )
}

const Total = (props) => {
  console.log(props);
  let sum = 0;
  props.exercise.forEach((ex) => {
    sum += ex;
  })
  return (
    <>
      <p>Number of exercises {sum}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header name={course}/>
      <Content part={[part1, part2, part3]} exercise={[exercises1, exercises2, exercises3]}/>
      <Total exercise={[exercises1, exercises2, exercises3]}/>
    </div>
  )
}

export default App