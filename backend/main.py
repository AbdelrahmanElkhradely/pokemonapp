from typing import List
import fastapi as _fastapi
import fastapi.security as _security

import sqlalchemy.orm as _orm
import uvicorn

import services as _services, schemas as _schemas

import http3

from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

app = _fastapi.FastAPI()



@app.post("/api/users")
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)

    return await _services.create_token(user)


@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user


@app.post("/api/pokemons", response_model=_schemas.Pokemon)
async def create_pokemon(
    pokemon: _schemas.PokemonCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_pokemon(user=user, db=db, pokemon=pokemon)


@app.get("/api/pokemons", response_model=List[_schemas.Pokemon])
async def get_pokemons(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_pokemons(user=user, db=db)


@app.get("/api/pokemons/{pokemon_id}", status_code=200)
async def get_pokemon(
    pokemon_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_pokemon(pokemon_id, user, db)


@app.delete("/api/pokemons/{pokemon_id}", status_code=204)
async def delete_pokemon(
    pokemon_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_pokemon(pokemon_id, user, db)
    return {"message", "Successfully Deleted"}


@app.get("/api/pokemons/{pokemon_name}/info", status_code=200)
async def get_pokemon_info(
    pokemon_name: str,
):

    client = http3.AsyncClient()
    url="https://pokeapi.co/api/v2/pokemon/"+pokemon_name
    r = await client.get(url)
    #json_compatible_item_data = jsonable_encoder(r.json())
    #return JSONResponse(content=json_compatible_item_data)
    return{r.text}

@app.get("/api")
async def root():
    return {"message": "Welcome to pokemons world"}


#if __name__ == "__main__":
#    uvicorn.run(app, host="127.0.0.1", port=5049)