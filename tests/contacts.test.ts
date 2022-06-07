import "jest";
import * as request from "supertest";

let address: string = global.address;

//Testes positivos
test("get /contatos", () => {
  return request(address)
    .get("/contatos")
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});

test("post /contatos", () => {
  return request(address)
    .post("/contatos")
    .send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    })
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("test");
      expect(response.body.birthday).toBe("1997-03-03T00:00:00.000Z");
      expect(response.body.gender).toBe("Male");
      expect(response.body.age).toBe(25);
    })
    .catch(fail);
});

test("post /contatos - nome obrigatorio", () => {
  return request(address)
    .post("/contatos")
    .send({
      birthday: "1997-03-03",
      gender: "Male",
    })
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors[0].error).toContain("name");
    })
    .catch(fail);
});

test("post /contatos - genero invalido", () => {
  return request(address)
    .post("/contatos")
    .send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Reptil",
    })
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].error).toContain("gender");
    })
    .catch(fail);
});

test("post /contatos - data de nascimento maior que hoje", () => {
  return request(address)
    .post("/contatos")
    .send({
      name: "test",
      birthday: "2030-03-03",
      gender: "Male",
    })
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].error).toContain(
        "A data de nascimento precisa ser maior do que a data de hoje."
      );
    })
    .catch(fail);
});

test("post /contatos - Contato menor de idade", () => {
  return request(address)
    .post("/contatos")
    .send({
      name: "test",
      birthday: "2020-03-03",
      gender: "Male",
    })
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].error).toContain(
        "O Contato precisa ser maior de 18 anos. ."
      );
    })
    .catch(fail);
});

//Criar contrato e filtrar por _id
test("get /contatos - findById", () => {
  return request(address)
    .post("/contatos")
    .send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    })
    .then((response) => request(address).get(`/contatos/${response.body._id}`))
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("test");
      expect(response.body.birthday).toBe("1997-03-03T00:00:00.000Z");
      expect(response.body.gender).toBe("Male");
    })
    .catch(fail);
});

test("delete /contatos/aaaaa - not found", () => {
  return request(address)
    .delete(`/contatos/aaaaa`)
    .then((response) => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});

test("delete /contatos:/id", () => {
  return request(address)
    .post("/contatos")
    .send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    })
    .then((response) =>
      request(address).delete(`/contatos/${response.body._id}`)
    )
    .then((response) => {
      expect(response.status).toBe(204);
    })
    .catch(fail);
});

test("patch /contatos/disable/aaaaa - not found", () => {
  return request(address)
    .patch(`/contatos/disable/aaaaa`)
    .then((response) => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});

//Cria um contato, o desativa e tenta achar-lo novamente
//Criar contrato e filtrar por _id
test("get /contatos - findById", () => {
  let _id = undefined;
  return request(address)
    .post("/contatos")
    .send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    })
    .then((response) => {
      _id = response.body._id;
      request(address).patch(`/contatos/disable/${_id}`).send({
        isActive: "false",
      });
    })
    .then((response) => {
      request(address)
        .get(`/contatos/${_id}`)
        .then((response) => {
          expect(response.status).toBe(404);
        });
    })
    .catch(fail);
});
