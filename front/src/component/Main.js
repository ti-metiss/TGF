import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "../utils/format";
import Button from "./Button";

const Main = () => {
  const [questions, setQuestions] = useState([]);
  const [sizeQuestions, setSizeQuestions] = useState(0);
  const [sort, setSort] = useState(true);
  const [orderBy, setOrderBy] = useState("creationQuestion");
  const [asc, setAsc] = useState(false);

  const formatUrl = (value) => {
    switch (value) {
      case "noAnswer":
        setSort(false);
        break;
      case "answer":
        setSort(true);
        break;
      case "older":
        setOrderBy("creationQuestion");
        setAsc(true);
        break;
      case "newer":
        setOrderBy("creationQuestion");
        setAsc(false);
        break;
      case "nbAnswer":
        setOrderBy("answer");
        setAsc(false);
        break;

      default:
        setSort(true);
        setOrderBy("answer");
        setAsc(false);
        break;
    }
  };

  useEffect(() => {
    let params = "answer=";
    if (sort) params += "true";
    else params += "false";
    params += "&orderby=";
    if (orderBy === "answer") params += "answer";
    else params += "creationQuestion";
    params += "&asc=";
    if (asc) params += "true";
    else params += "false";

    let url = `${process.env.REACT_APP_URL}/questions?${params}`;

    axios
      .get(url)
      .then(function (res) {
        setQuestions(res.data.questions);
        setSizeQuestions(res.data.size);
      })
      .catch(function (error) {});
  }, [sort, orderBy, asc]);

  const handleQuestion = (id) => {
    console.log("demande de la question");
    console.log(id);
  };

  return (
    <main className="main">
      <div className="allInfo">
        <div className="allInfoQuestion">
          <p className="allInfoQuestion__text">Toutes les questions</p>
          <p className="allInfoQuestion__nb">
            {sizeQuestions} {sizeQuestions > 1 ? "questions" : "question"}
          </p>
        </div>
        <div className="allInfo__filterBtn">
          <div>
            <Button value="Filter" bgColor="blueLight" height="50" width="90" />
          </div>
          <div>
            <Button value="Poser une question" height="50" width="150" />
          </div>
        </div>
        <div className="filterInfo">
          <div className="filterInfo__filter">
            <p>Filtrer par : </p>
            <ul className="filterInfo__list">
              <li>
                <input
                  type="radio"
                  id="response"
                  name="answer"
                  value="answer"
                  defaultChecked
                  onChange={(e) => formatUrl(e.target.value)}
                />
                <label htmlFor="response">Réponse</label>
              </li>
              <li>
                <input
                  type="radio"
                  id="noResponse"
                  name="answer"
                  value="noAnswer"
                  onChange={(e) => formatUrl(e.target.value)}
                />
                <label htmlFor="noResponse">Aucune Réponse</label>
              </li>
            </ul>
          </div>
          <div className="filterInfo__order">
            <p>Trier par : </p>
            <ul>
              <li>
                {" "}
                <input
                  type="radio"
                  id="recent"
                  name="order"
                  value="newer"
                  defaultChecked
                  onChange={(e) => formatUrl(e.target.value)}
                />
                <label htmlFor="recent">Plus récent</label>
              </li>
              <li>
                {" "}
                <input
                  type="radio"
                  id="older"
                  name="order"
                  value="older"
                  onChange={(e) => formatUrl(e.target.value)}
                />
                <label htmlFor="older">Plus ancien</label>
              </li>
              <li>
                {" "}
                <input
                  type="radio"
                  id="nbAnswer"
                  name="order"
                  value="nbAnswer"
                  onChange={(e) => formatUrl(e.target.value)}
                />
                <label htmlFor="nbAnswer">Nombre de réponse</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="allQuestions">
        {questions
          ? questions.map((data, index) => {
              return (
                <div
                  key={index}
                  className="questionGroup"
                  onClick={() => handleQuestion(data._id)}
                >
                  <div className="questionGroup__info">
                    <p>0 votes</p>
                    <p>
                      {data.comments.length}
                      {data.comments.length > 1 ? " réponse" : " réponses"}
                    </p>
                  </div>
                  <div className="questionGroup__question">
                    <p> {data.question} </p>
                  </div>
                  <div className="questionGroup__user">
                    <p> {data.user.username} </p>
                    <p> posté il y a {format(data.creationQuestion)} </p>
                  </div>
                  <div className="questionGroup__updateQuestion">
                    <p> MAJ : </p>
                    <p> &nbsp; {format(data.updateQuestion)} </p>
                  </div>
                </div>
              );
            })
          : "Loading..."}
      </div>
    </main>
  );
};

export default Main;
