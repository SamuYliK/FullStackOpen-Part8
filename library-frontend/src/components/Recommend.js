import { useQuery } from "@apollo/client"
import { BOOKS_BY_GENRE } from "../queries"

const Recommend = ({ show, token, genreToSearch }) => {
  const result = useQuery(BOOKS_BY_GENRE, {
    variables: { genreToSearch },
    skip: !genreToSearch,
  })

  if (!show || !token) {
    return null
  }

  if (result.loading) {
    return <div>loading data...</div>
  }

  if (genreToSearch && result.data) {
    return (
      <div>
        <h2>Recommendations</h2>
        <p>
          books in your favorite genre <b>{genreToSearch}</b>
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
      </div>
    )
  }
  return <div>Favorite genre not known...</div>
}

export default Recommend
