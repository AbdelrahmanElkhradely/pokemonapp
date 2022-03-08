import React, { useContext, useEffect, useState,Fragment } from "react";

import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import LeadModal from "./LeadModal";
import { UserContext } from "../context/UserContext";
import { ModalProvider, ModalConsumer } from "../context/ModalContext";
import ModalRoot from "./ModalRoot";
import Modal from "react-modal";
import InfoModal from "./InfoModal";

const Table = () => {
  const [token] = useContext(UserContext);
  const [pokemons, setPokemons] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);



  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/pokemons/${id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Failed to delete pokemon");
    }
    getPokemons();
  };





  const getPokemons = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/pokemons", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the pokemons");
    } else {
      const data = await response.json();
      setPokemons(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getPokemons();
  }, []);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getPokemons();
    setId(null);
  };


  

  return (
    <ModalProvider>
    <ModalRoot />
    <ModalConsumer>
    {({ showModal }) => (
    <Fragment>

    <>

      <button
        className="button is-fullwidth mb-5 is-primary"
        onClick={() => {
          showModal(LeadModal, { setPokemons:setPokemons,setLoaded:setLoaded ,token: token, id:id, });
          
        }}

      >
        ADD POKEMON
      </button>
      <ErrorMessage message={errorMessage} />
      {loaded && pokemons ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Updated</th>
              <th>Actions</th>

            </tr>
          </thead>
          <tbody>
            {pokemons.map((pokemon) => (
              <tr key={pokemon.id}>
                <td>{pokemon.name}</td>

                <td>{moment(pokemon.date_last_updated).format("MMM Do YY")}</td>
                <td>
                <button
                    className="button mr-4 is-info is-light"
                    onClick={() => {
                      showModal(InfoModal, { pokemon_name: pokemon.name ,token: token, id:id});

                    }}
                  >
                    Info
                  </button>
                  <button
                    className="button mr-4 is-danger is-light"
                    
                    onClick={() => handleDelete(pokemon.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading</p>
      )}
    </>
    </Fragment>
      )}
    </ModalConsumer>
    </ModalProvider>

  );
};

export default Table;