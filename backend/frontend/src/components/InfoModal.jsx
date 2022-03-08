import React, { useEffect, useState } from "react";
import { ModalProvider, ModalConsumer } from "../context/ModalContext";
import ModalRoot from "./ModalRoot";
import Modal from "react-modal";
import Row from 'react-row'

const InfoModal = ({ active, handleModal, pokemon_name, token, id, setErrorMessage, onRequestClose, ...otherProps }) => {
  const [name, setName] = useState("");
  let pokemon_info = null;
  const [pokemonsinfo, setpokemonsinfo] = useState(null);




  const handleInfo = async (pokemon_name) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/pokemons/${pokemon_name}/info`, requestOptions);

    const data = await response.json();

    var arr = [];
    Object.keys(data).forEach(function (key) {
      arr.push(data[key]);
    });



    setpokemonsinfo(arr[0]);
    if (!response.ok) {
      setErrorMessage("Failed to get pokemon info");
    }
  };
  useEffect(() => {
    handleInfo(pokemon_name);
    console.log(pokemonsinfo);
  }, [pokemonsinfo]);

  if (pokemonsinfo) {
    return (

      <Modal isOpen onRequestClose={onRequestClose} {...otherProps} transparent={true}
        size="lg"
      >
        <div>
          <div></div>
          <div className="modal-card">
            <header className="modal-card-head has-background-primary-light">
              <p className="modal-card-title">{pokemon_name}</p>
              <button className="delete" aria-label="close"></button>
            </header>
            <section className="modal-card-body">
              <div className="field-group">
                <div className="field is-inline-block-desktop">
                  <label className="label">Weight :   </label>
                  <label className="label">Height :   </label>
                  <label className="label">Order :    </label>


                </div>

                <div className="field is-inline-block-desktop">
                  <label className="label">   {pokemonsinfo}</label>

                  <label className="label">   Height</label>
                  <label className="label">   Order</label>

                </div>
              </div>






            </section>
            <footer className="modal-card-foot has-background-primary-light">
              <button className="button"

                onClick={
                  onRequestClose
                }


              >
                Close
              </button>
            </footer>
          </div>
        </div>
      </Modal>
    );
  } else {
    return (

      <Modal isOpen onRequestClose={onRequestClose} {...otherProps} transparent={true}
        size="lg"
      >
        <div>
          <div></div>
          <div className="modal-card">
            <header className="modal-card-head has-background-primary-light">
              <p className="modal-card-title">{pokemon_name}</p>
              <button className="delete" aria-label="close"></button>
            </header>
            <section className="modal-card-body">
              <div className="field-group">
                <div className="field is-inline-block-desktop">
                  <label className="label">Weight :   </label>
                  <label className="label">Height :   </label>
                  <label className="label">Order :    </label>


                </div>

                <div className="field is-inline-block-desktop">
                  <label className="label">   none</label>
                  <label className="label">   none</label>
                  <label className="label">   none</label>

                </div>
              </div>






            </section>
            <footer className="modal-card-foot has-background-primary-light">
              <button className="button"

                onClick={
                  onRequestClose
                }


              >
                Close
              </button>
            </footer>
          </div>
        </div>
      </Modal>
    );
  };
};
export default InfoModal;