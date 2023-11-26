import { useState } from "react"
import { useQuery } from "@apollo/client"
import { BOOKS_BY_GENRE } from "../queries"

const Books = (props) => {
  const books = props.books
  const [genreToSearch, setGenreToSearch] = useState(null)

  const genres = props.books.reduce((a, current) => {
    for (let i = 0; i < current.genres.length; i++) {
      let genre = current.genres[i]
      if (!a.includes(genre)) {
        a = [...a, genre]
      }
    }
    return a
  }, [])

  const result = useQuery(BOOKS_BY_GENRE, {
    variables: { genreToSearch },
    pollInterval: 200,
  })

  if (!props.show) {
    return null
  }

  if (genreToSearch && result.data) {
    return (
      <div>
        <h2>books</h2>
        <p>
          in genre <b>{genreToSearch}</b>
        </p>

        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {result.data.allBooks.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenreToSearch(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenreToSearch(null)}>all genres</button>
      </div>
    )
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenreToSearch(g)}>
          {g}
        </button>
      ))}
    </div>
  )
}

export default Books
