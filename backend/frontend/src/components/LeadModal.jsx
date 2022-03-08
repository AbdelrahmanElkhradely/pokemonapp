import React, { useEffect, useState } from "react";
import { ModalProvider, ModalConsumer} from "../context/ModalContext";
import ModalRoot from "./ModalRoot";
import Modal from "react-modal";

const LeadModal = ({ active, handleModal, setPokemons,setLoaded,token,id, setErrorMessage ,onRequestClose, ...otherProps}) => {
  const [name, setName] = useState("");


  useEffect(() => {
    const getPokemons = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(`/api/Pokemons/${id}`, requestOptions);

      if (!response.ok) {
        setErrorMessage("Could not get the pokemons");
      } else {
        const data = await response.json();
        setName(data.name);
      }
    };

    if (id) {
      getPokemons();
    }
  }, [id, token]);

  const cleanFormData = () => {
    setName("");
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

  const handleCreatePokemons = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: name,
      }),
    };
    const response = await fetch("/api/pokemons", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong when creating pokemon");
    } else {
      cleanFormData();
      getPokemons();
      onRequestClose();

    }
  };


  return (
    <Modal modal-content isOpen onRequestClose={onRequestClose} {...otherProps}>
    <div  >
      <div ></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">
            {id ? "Update pokemon" : "Create pokemon"}
          </h1>
        </header>
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter  name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          
           </form>
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          {id  ? (
            <button className="button is-info" >
              Update
            </button>)
          :(
            <button className="button is-primary" onClick={handleCreatePokemons}>
              Create
            </button>
          )}
          <button className="button" onClick={onRequestClose}>
            Cancel
          </button>

        </footer>
      </div>
    </div>
    </Modal>
  );
};

export default LeadModal;