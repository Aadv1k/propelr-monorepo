/*
import { useEffect, useState } from "react";


export default function Dashboard({ origin }: { origin?: string }) {
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (origin) {
      fetch(`http://localhost:4000/api/oauth/google/token?${objectToQueryString(Object.fromEntries(oAuthParams))}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
      
    }


  }, [])


  return (
    <h1>
      Hello world
    </h1>
  )
}*/

export {}
