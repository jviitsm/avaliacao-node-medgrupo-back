import "jest";
import * as request from "supertest";

let address: string = global.address;

//Testes positivos
test("get /contatos", async () => {
  try {
    const response = await request(address).get("/contatos");
    expect(response.status).toBe(200);
    expect(response.body.items).toBeInstanceOf(Array);
  } catch (err) {
    return fail(err);
  }
});

test("post /contatos", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    });
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe("test");
    expect(response.body.birthday).toBe("1997-03-03T00:00:00.000Z");
    expect(response.body.gender).toBe("Male");
    expect(response.body.age).toBe(25);
  } catch (err) {
    return fail(err);
  }
});

test("post /contatos calcular idade certa 30 anos ", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "1992-03-03",
      gender: "Male",
    });
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.age).toBe(30);
  } catch (err) {
    return fail(err);
  }
});

test("post /contatos - nome obrigatorio", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      birthday: "1997-03-03",
      gender: "Male",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0].error).toContain("name");
  } catch (err) {
    return fail(err);
  }
});

test("post /contatos - genero invalido", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Reptil",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].error).toContain("gender");
  } catch (err) {
    return fail(err);
  }
});

test("post /contatos - data de nascimento maior que hoje", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "2030-03-03",
      gender: "Male",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].error).toContain(
      "A data de nascimento precisa ser maior do que a data de hoje."
    );
  } catch (err) {
    return fail(err);
  }
});

test("post /contatos - Contato menor de idade", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "2020-03-03",
      gender: "Male",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].error).toContain(
      "O Contato precisa ser maior de 18 anos"
    );
  } catch (err) {
    return fail(err);
  }
});

//Criar contrato e filtrar por _id
test("get /contatos - findById", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    });
    const responseGet = await request(address).get(
      `/contatos/${response.body._id}`
    );
    expect(responseGet.status).toBe(200);
    expect(responseGet.body.name).toBe("test");
    expect(responseGet.body.birthday).toBe("1997-03-03T00:00:00.000Z");
    expect(responseGet.body.gender).toBe("Male");
  } catch (err) {
    return fail(err);
  }
});

test("delete /contatos/aaaaa - not found", async () => {
  try {
    const response = await request(address).delete(`/contatos/aaaaa`);
    expect(response.status).toBe(404);
  } catch (err) {
    return fail(err);
  }
});

test("delete /contatos:/id", async () => {
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    });
    const deleteResponse = await request(address).delete(
      `/contatos/${response.body._id}`
    );
    expect(deleteResponse.status).toBe(204);
  } catch (err) {
    return fail(err);
  }
});

test("patch /contatos/disable/aaaaa - not found", async () => {
  try {
    const response = await request(address).patch(`/contatos/disable/aaaaa`);
    expect(response.status).toBe(404);
  } catch (error) {
    return fail(error);
  }
});

//Cria um contato, o desativa e tenta achar-lo novamente
test("post patch e get /contatos - Cria um contato, o desativa e tenta achar-lo novamente", async () => {
  let _id = undefined;
  try {
    const response = await request(address).post("/contatos").send({
      name: "test",
      birthday: "1997-03-03",
      gender: "Male",
    });
    _id = response.body._id;
    await request(address).patch(`/contatos/disable/${_id}`).send({
      isActive: "false",
    });
    const getDisabled = await request(address).get(`/contatos/${_id}`);
    expect(getDisabled.status).toBe(404);
  } catch (error) {
    return fail(error);
  }
});
