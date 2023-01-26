import Head from "next/head";
import { useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  NavLink,
  MediaQuery,
  Burger,
  useMantineTheme,
  Table,
  Code,
  Select,
  Checkbox,
  Divider,
} from "@mantine/core";
import { IconDatabase, IconChevronRight, IconCircleOff } from "@tabler/icons";
import { TextInput, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { ActionIcon } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";

export default function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(9999);
  const [databases, setDatabases] = useState([]);
  const [databaseSelected, setDatabaseSelected] = useState([]);
  const [databaseNameSelected, setDatabaseNameSelected] = useState("");
  const [tableauSelected, setTableauSelected] = useState("");
  const [dataGotById, setDataGotById] = useState("");
  const [dataGotByField, setDataGotByField] = useState("");
  const [dataFromDatabase, setDataFromDatabases] = useState(false);

  const [dataInfoForInsertion, setDataInfoForInsertion] = useState([]);

  // FAIRE DELETE ET PUT !!!!

  const formCreateDatabase = useForm({
    initialValues: {
      databaseName: "",
    },
  });

  const formDeleteDatabase = useForm({
    initialValues: {
      databaseName: "",
    },
  });

  const formCreateTableau = useForm({
    initialValues: {
      tableauName: "",
    },
  });

  const formDeleteTableau = useForm({
    initialValues: {
      tableauName: "",
    },
  });

  const formGetById = useForm({
    initialValues: {
      idData: "",
    },
  });

  const formGetByField = useForm({
    initialValues: {
      fieldSearchArr: [],
    },
  });

  const formCreateByField = useForm({
    initialValues: {
      fieldSearchArr: [],
    },
  });

  const formElementTableau = useForm({
    initialValues: {
      elementTableau: [],
    },
  });

  const fieldsTableau = formElementTableau.values.elementTableau.map(
    (item, index) => (
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}
        key={item.key}
      >
        <TextInput
          placeholder="champ"
          sx={{ flex: 1 }}
          {...formElementTableau.getInputProps(`elementTableau.${index}.name`)}
        />
        <Select
          style={{ marginTop: "8px" }}
          placeholder="String ou number"
          {...formElementTableau.getInputProps(`elementTableau.${index}.type`)}
          data={[
            { value: "number", label: "Number" },
            { value: "string", label: "String" },
          ]}
        />
        <Checkbox
          style={{ textAlign: "center" }}
          label="Required"
          color="violet"
          mt="sm"
          {...formElementTableau.getInputProps(
            `elementTableau.${index}.required`,
            {
              type: "checkbox",
            }
          )}
        />
        <ActionIcon
          color="violet"
          onClick={() =>
            formElementTableau.removeListItem("elementTableau", index)
          }
        >
          <IconTrash size={16} />
        </ActionIcon>
      </div>
    )
  );

  const fieldsSearch = formGetByField.values.fieldSearchArr.map(
    (item, index) => {
      return (
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}
          key={item.key}
        >
          <TextInput
            style={{ marginTop: "8px" }}
            disabled
            placeholder="champ"
            sx={{ flex: 1 }}
            {...formGetByField.getInputProps(`fieldSearchArr.${index}.field`)}
          />
          <TextInput
            style={{ marginTop: "8px" }}
            placeholder="value"
            sx={{ flex: 1 }}
            {...formGetByField.getInputProps(
              `fieldSearchArr.${index}.valueToSearch`
            )}
          />
          <ActionIcon
            color="violet"
            onClick={() =>
              formGetByField.removeListItem("fieldSearchArr", index)
            }
          >
            <IconTrash size={16} />
          </ActionIcon>
        </div>
      );
    }
  );

  const fieldsCreate = formCreateByField.values.fieldSearchArr.map(
    (item, index) => (
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}
        key={item.key}
      >
        <TextInput
          style={{ marginTop: "8px" }}
          disabled
          placeholder="champ"
          sx={{ flex: 1 }}
          {...formCreateByField.getInputProps(`fieldSearchArr.${index}.field`)}
        />
        <TextInput
          style={{ marginTop: "8px" }}
          placeholder="value"
          sx={{ flex: 1 }}
          {...formCreateByField.getInputProps(
            `fieldSearchArr.${index}.valueToSearch`
          )}
        />
        {!item.required && (
          <ActionIcon
            color="violet"
            onClick={() =>
              formCreateByField.removeListItem("fieldSearchArr", index)
            }
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </div>
    )
  );

  // GET DATABASES
  const handleGetDatabases = async () => {
    try {
      const resGetDatabases = await axios.get("http://localhost:8000/");

      const data = resGetDatabases.data.bdd.map((el) => {
        return {
          icon: IconDatabase,
          label: el,
          rightSection: <IconChevronRight size={14} stroke={1.5} />,
        };
      });
      setDatabases(data);
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // GET DATABASES DETAILS
  const handleGetDataFromDatabases = async (url) => {
    setDatabaseNameSelected(url);
    try {
      const resBack = await axios.get(`http://localhost:8000/${url}`);

      const elData = resBack.data;

      let tablesDatabase = [];
      // let infoData = [];

      for (const datazer in elData) {
        let th = datazer;
        let td = [];

        for (const el in elData[datazer]) {
          // infoData.push({ ...elData[datazer][el], nameField: el });

          td.push(
            <th key={el} style={{ width: "100%", textAlign: "center" }}>
              {el}
            </th>
          );
        }
        tablesDatabase.push(
          <Table
            style={{
              margin: "20px",
              width: "600px",
              border: "1px solid #dee2e6",
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleGetDatabaseFull(`${url}/${th}`);

              let infoData = [];

              for (const el in elData[datazer]) {
                infoData.push({ ...elData[datazer][el], nameField: el });

                td.push(
                  <th key={el} style={{ width: "100%", textAlign: "center" }}>
                    {el}
                  </th>
                );
              }

              setDataInfoForInsertion(infoData);

              setTableauSelected(th);
            }}
            key={th + "top"}
          >
            <thead>
              <tr key={th}>
                <th>{th} (détail du tableau)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{ display: "flex", flexDirection: "column" }}
                key={th + "bottom"}
              >
                {td}
              </tr>
            </tbody>
          </Table>
        );
      }

      setDatabaseSelected(tablesDatabase);
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // GET DATABASES DATA
  const handleGetDatabaseFull = async (url) => {
    try {
      const res = await axios.get(`http://localhost:8000/${url}`);

      if (res.data) {
        setDataFromDatabases(res.data);
      }
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // POST CREATE DATABASE
  const handleCreateDatabase = async (value) => {
    try {
      const res = await axios.post(`http://localhost:8000/${value}`);

      if (res.data === '{message : "This name is already used by a bdd !"}') {
        showNotification({ message: "ce nom est déjà pris", color: "red" });
        return;
      }
      showNotification({
        message: "Création de la base de donnée réussis",
        color: "violet",
      });
      await handleGetDatabases();
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // POST CREATE TABLEAU
  const handleCreateTable = async () => {
    try {
      let dataTableauToSend = {};

      formElementTableau.values.elementTableau.map((el) => {
        dataTableauToSend[el.name] = { type: el.type, required: el.required };
      });

      const res = await axios.post(
        `http://localhost:8000/${databaseNameSelected}/${formCreateTableau.values.tableauName}`,
        dataTableauToSend
      );

      if (
        res.data ===
        `{message : "Table ${formCreateTableau.values.tableauName} already exist in the database test !"}`
      ) {
        showNotification({ message: "ce nom est déjà pris", color: "red" });
        return;
      }
      showNotification({
        message: "Création de la table réussis",
        color: "violet",
      });
      await handleGetDataFromDatabases(databaseNameSelected);
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // POST DELETE TABLEAU
  const handleDeleteTable = async () => {
    try {
      console.log("delete function");
      const res = await axios.delete(
        `http://localhost:8000/${databaseNameSelected}/${formCreateTableau.values.tableauName}`
      );
      console.log("🚀 ~ file: index.js:370 ~ handleDeleteTable ~ res", res);

      showNotification({
        message: "Suppression de la table réussis",
        color: "violet",
      });
      await handleGetDataFromDatabases(databaseNameSelected);
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // GET DATA BY ID
  const handleGetDataByIdOrById = async (value) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/${databaseNameSelected}/${tableauSelected}?id=${value}`
      );

      setDataGotById(res.data);
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // GET DATA BY FIELD
  const handleGetDataByIdOrByField = async (value) => {
    let stringSearch = "";

    value.fieldSearchArr.map((el) => {
      if (!stringSearch) {
        stringSearch = `?${el.field}=${el.valueToSearch}`;
      } else {
        stringSearch = `${stringSearch}&${el.field}=${el.valueToSearch}`;
      }
    });

    const res = await axios.get(
      `http://localhost:8000/${databaseNameSelected}/${tableauSelected}${stringSearch}`
    );

    setDataGotByField(res.data);
    try {
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  // POST CREATE DATA
  const handleCreateDataInTable = async (value) => {
    try {
      const insertionValue = value.fieldSearchArr;

      let dataTableauToSend = {};

      insertionValue.map((el) => {
        if (el.type === "number") {
          dataTableauToSend[el.field] = +el.valueToSearch;
        } else {
          dataTableauToSend[el.field] = el.valueToSearch;
        }
      });

      const res = await axios.post(
        `http://localhost:8000/${databaseNameSelected}/${tableauSelected}/create`,
        dataTableauToSend
      );

      const resData = await axios.get(
        `http://localhost:8000/${databaseNameSelected}/${tableauSelected}`
      );

      if (resData.data) {
        setDataFromDatabases(resData.data);
      }
    } catch (e) {
      console.log("error ->", e.message);
      showNotification({ message: "Mauvais type de donnée", color: "red" });
    }
  };

  // DELETE DB
  const handleDeleteDatabase = async (value) => {
    try {
      await axios.delete(`http://localhost:8000/${value}`);

      showNotification({
        message: "Base de donnée supprimée",
        color: "violet",
      });
      await handleGetDatabases();
    } catch (e) {
      console.log("error ->", e.message);
    }
  };

  let items = databases.map((item, index) => {
    return (
      <NavLink
        key={item.label}
        active={index === active}
        label={item.label}
        description={item.description}
        rightSection={item.rightSection}
        icon={<item.icon size={16} stroke={1.5} />}
        onClick={(e) => {
          handleGetDataFromDatabases(e.target.innerText);
          setActive(index);
        }}
        color="violet"
        variant="subtle"
      />
    );
  });

  if (databases.length === 0) {
    items = (
      <NavLink
        label="Aucun résultat"
        icon={<IconCircleOff size={16} stroke={1.5} />}
        disabled
      />
    );
  }

  useEffect(() => {
    handleGetDatabases();
  }, []);

  useEffect(() => {
    setDatabaseSelected([]);
    setDatabaseNameSelected("");
    setDataFromDatabases(false);
    setTableauSelected("");
    setDataGotById("");
    setDataGotByField("");
  }, [databases]);

  useEffect(() => {
    setDataFromDatabases(false);
    setTableauSelected("");
    setDataGotById("");
    setDataGotByField("");
  }, [databaseSelected]);

  return (
    <div>
      <Head>
        <title>Web service database</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
            style={{
              paddingLeft: "0px",
              paddingRight: "0px",
              paddingTop: "0px",
            }}
          >
            <div
              style={{
                fontWeight: "700",
                padding: "15px",
                paddingLeft: "10px",
              }}
            >
              Liste des bases de données :
            </div>
            {items}
            <Box
              sx={{ maxWidth: 700 }}
              style={{ marginTop: "25px", margin: "10px" }}
              mx="auto"
            >
              <form
                onSubmit={formCreateDatabase.onSubmit((values) => {
                  handleCreateDatabase(values.databaseName);
                })}
              >
                <TextInput
                  label="Ajouter une nouvelle base de donnée"
                  placeholder="Nom"
                  {...formCreateDatabase.getInputProps("databaseName")}
                />
                <Group position="right" mt="md">
                  <Button color="violet" type="submit">
                    Créer
                  </Button>
                </Group>
              </form>
            </Box>
            <Box
              sx={{ maxWidth: 700 }}
              style={{ marginTop: "25px", margin: "10px" }}
              mx="auto"
            >
              <form
                onSubmit={formDeleteDatabase.onSubmit((values) => {
                  handleDeleteDatabase(values.databaseName);
                })}
              >
                <TextInput
                  label="Supprimer une base de donnée"
                  placeholder="Nom"
                  {...formDeleteDatabase.getInputProps("databaseName")}
                />
                <Group position="right" mt="md">
                  <Button color="violet" type="submit">
                    Supprimer
                  </Button>
                </Group>
              </form>
            </Box>
          </Navbar>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <div style={{ textAlign: "center", fontWeight: "800" }}>
                Web service
              </div>
            </div>
          </Header>
        }
      >
        {/* main content */}

        {active === 9999 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "45px",
              position: "relative",
            }}
          >
            <div>Aucune base sélectionée</div>
          </div>
        )}

        {active !== 9999 && (
          <>
            <Box
              sx={{ maxWidth: 700 }}
              style={{ margin: "auto", marginBottom: "40px" }}
              mx="auto"
            >
              <form
                onSubmit={formDeleteTableau.onSubmit((values) => {
                  handleDeleteTable(values.tableauName);
                })}
              >
                <TextInput
                  label="Supprimer un tableau"
                  placeholder="Nom"
                  {...formDeleteTableau.getInputProps("tableauName")}
                />
                <Group
                  position="center"
                  style={{ marginBottom: "8px" }}
                  mt="md"
                >
                  <Button color="violet" type="submit">
                    Supprimer
                  </Button>
                </Group>
              </form>

              <form
                onSubmit={formCreateTableau.onSubmit((values) => {
                  handleCreateTable(values.tableauName);
                })}
              >
                <TextInput
                  label="Ajouter un nouveau tableau"
                  placeholder="Nom"
                  {...formCreateTableau.getInputProps("tableauName")}
                />
              </form>
              {fieldsTableau}
              <Group position="center" mt="md">
                <Button
                  onClick={() =>
                    formElementTableau.insertListItem("elementTableau", {
                      name: "",
                      key: randomId(),
                      type: "string",
                      required: true,
                    })
                  }
                  color="violet"
                  variant="subtle"
                >
                  + ajouter un champ
                </Button>
              </Group>
              <Group position="center" style={{ marginBottom: "8px" }} mt="md">
                <Button color="violet" onClick={handleCreateTable}>
                  Créer
                </Button>
              </Group>
            </Box>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {databaseSelected.length > 0 ? (
                databaseSelected
              ) : (
                <div>Aucune table</div>
              )}
            </div>
            {dataFromDatabase && (
              <div
                style={{
                  margin: "15px",
                  width: "600px",
                  margin: "auto",
                  borderRadius: "25px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>Insérer des données</div>
                {fieldsCreate}
                {fieldsCreate.length === 0 && (
                  <Group position="center" mt="md">
                    <Button
                      onClick={() => {
                        dataInfoForInsertion.map((el) => {
                          if (el.nameField === "id") {
                            return;
                          }
                          formCreateByField.insertListItem("fieldSearchArr", {
                            valueToSearch: "",
                            key: randomId(),
                            field: el.nameField,
                            type: el.type,
                            required: el.required,
                          });
                        });
                      }}
                      color="violet"
                      variant="subtle"
                    >
                      + ajouter des champ
                    </Button>
                  </Group>
                )}
                {fieldsCreate.length > 0 && (
                  <Group position="center" mt="md">
                    <Button
                      onClick={() => {
                        for (
                          let i = -1;
                          i < dataInfoForInsertion.length + 5;
                          i++
                        ) {
                          formCreateByField.removeListItem("fieldSearchArr", i);
                        }
                        formCreateByField.removeListItem("fieldSearchArr", 0);
                      }}
                      color="violet"
                      variant="subtle"
                    >
                      - réinitialiser
                    </Button>
                  </Group>
                )}
                {fieldsCreate.length > 0 && (
                  <Group
                    position="center"
                    style={{ marginBottom: "8px" }}
                    mt="md"
                  >
                    <Button
                      color="violet"
                      onClick={() => {
                        handleCreateDataInTable(formCreateByField.values);
                      }}
                    >
                      Créer
                    </Button>
                  </Group>
                )}
                <Code style={{ background: "white" }} block mt={5}>
                  {JSON.stringify(dataFromDatabase, null, 2)}
                </Code>
                <form
                  onSubmit={formGetById.onSubmit((values) => {
                    handleGetDataByIdOrById(values.idData);
                  })}
                  style={{ marginTop: "15px" }}
                >
                  <Divider color="violet" my="sm"></Divider>
                  <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                    Recherche par ID
                  </div>
                  <TextInput
                    placeholder="ID"
                    {...formGetById.getInputProps("idData")}
                  />
                </form>

                <Code
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    border: "2px solid black",
                  }}
                  block
                  mt={5}
                >
                  {JSON.stringify(dataGotById || [], null, 2)}
                </Code>

                <Box
                  sx={{ maxWidth: 700 }}
                  style={{
                    margin: "auto",
                    marginBottom: "40px",
                    marginTop: "15px",
                  }}
                  mx="auto"
                >
                  <Divider color="violet" my="sm"></Divider>
                  <div style={{ fontWeight: "bold" }}>Recherche par champs</div>
                  {fieldsSearch}
                  {fieldsSearch.length === 0 && (
                    <Group position="center" mt="md">
                      <Button
                        onClick={() => {
                          dataInfoForInsertion.map((el) => {
                            if (el.nameField === "id") {
                              return;
                            }
                            formGetByField.insertListItem("fieldSearchArr", {
                              valueToSearch: "",
                              key: randomId(),
                              field: el.nameField,
                            });
                          });
                        }}
                        color="violet"
                        variant="subtle"
                      >
                        + ajouter les champs de recherche
                      </Button>
                    </Group>
                  )}
                  {fieldsSearch.length > 0 && (
                    <Group position="center" mt="md">
                      <Button
                        onClick={() => {
                          for (
                            let i = -1;
                            i < dataInfoForInsertion.length + 5;
                            i++
                          ) {
                            formGetByField.removeListItem("fieldSearchArr", i);
                          }
                          formGetByField.removeListItem("fieldSearchArr", 0);
                        }}
                        color="violet"
                        variant="subtle"
                      >
                        - réinitialiser
                      </Button>
                    </Group>
                  )}
                  <Group
                    position="center"
                    style={{ marginBottom: "8px" }}
                    mt="md"
                  >
                    <Button
                      color="violet"
                      onClick={() =>
                        handleGetDataByIdOrByField(formGetByField.values)
                      }
                    >
                      Chercher
                    </Button>
                  </Group>
                  <Code
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      border: "2px solid black",
                    }}
                    block
                    mt={5}
                  >
                    {JSON.stringify(dataGotByField || [], null, 2)}
                  </Code>
                </Box>
              </div>
            )}
          </>
        )}
      </AppShell>
    </div>
  );
}
