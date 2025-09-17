const Button = ({ onclick, text, style }) => (
  <button onClick={onclick} style={style}>{text}</button>
)

export default Button