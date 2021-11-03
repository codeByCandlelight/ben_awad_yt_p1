import * as React from 'react';
import './App.css';
import axios from 'axios';

const { useEffect, useState } = React;

// https://randomuser.me/api

interface UserName {
  first: string;
  last: string;
  title: string;
}

interface UserPicture {
  thumbnail: string;
}

interface UserInfo {
  name: UserName;
  picture: UserPicture;
}

/*
axios.get('/user?ID=12345')
.then(function (response) {
  // handle success
  console.log(response);
})
.catch(function (error) {
  // handle error
  console.log(error);
})
.then(function () {
  // always executed
});
*/

const fetchRandomData = (pageNumber: number): Promise<any> => {
  //?page=2
  return axios
    .get(`https://randomuser.me/api?page=${pageNumber}`)
    .then(({ data }) => {
      // handle success
      console.log(data);
      return data;
    })
    .catch((err) => {
      // handle error
      console.error(err);
    });
};

const getFullUserName = (userInfo: UserInfo) => {
  const {
    name: { first, last },
  } = userInfo;
  return `${first} ${last}`;
};

export default function App() {
  const [counter, setCounter] = useState(0);
  const [nextPageNumber, setNextPageNumber] = useState(1);
  const [userInfos, setUserInfos] = useState<any>([]);
  const [randomUserDataJSON, setRandomUserDataJSON] = useState("");

  const fetchNextUser = () => {
    fetchRandomData(nextPageNumber).then((randomData) => {
      // setRandomUserDataJSON(JSON.stringify(randomData, null, 2) || "No page number found.")
      if (randomData === undefined) return;
      const newUserInfos = [
        ...userInfos, 
        ...randomData.results,
      ]
      setUserInfos(newUserInfos);
      setNextPageNumber(randomData.info.page + 1)
    });
  }

  useEffect(() => {
    fetchNextUser();
  }, [fetchNextUser]);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <p>{counter}</p>
      <button
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        Increase Counter
      </button>
      <button
        onClick={() => {
          fetchNextUser();
        }}
      >
        Fetch Next User
      </button>
      {userInfos.map((userInfo: UserInfo, idx: number) => (
        <div key={idx}>
          <p>{getFullUserName(userInfo)}</p>
          <img src={userInfo.picture.thumbnail} alt="" />
        </div>
      ))}
      <pre>{randomUserDataJSON}</pre>
    </div>
  );
}
