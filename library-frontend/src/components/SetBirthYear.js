import { useState } from "react"
import { useMutation } from "@apollo/client"
import Select from "react-select"
import { ADD_AUTHOR, ALL_AUTHORS } from "../queries"

const SetBirthYear = (props) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  const nimet = props.authors.map((a) => ({ value: a.name, label: a.name }))

  const [updateAuthor] = useMutation(ADD_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show || !props.token) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    updateAuthor({ variables: { name: name.value, born } })
    setName("")
    setBorn("")
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <Select onChange={setName} options={nimet} />
        </div>
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthYear

/*
<input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
*/
