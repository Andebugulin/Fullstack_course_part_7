import axios from 'axios'
import { useState } from 'react'

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then(response => {
        setResources(resources.concat(response.data))
      })
      .catch(error => {
        console.error('Error creating resource:', error)
      })

  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}