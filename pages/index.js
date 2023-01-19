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
} from "@mantine/core";
import { IconDatabase, IconChevronRight, IconCircleOff } from "@tabler/icons";
import { TextInput, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { Switch, ActionIcon, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";

export default function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(9999);
  const [databases, setDatabases] = useState([]);
  const [databaseSelected, setDatabaseSelected] = useState([]);
  const [databaseNameSelected, setDatabaseNameSelected] = useState("");
  const [dataFromDatabase, setDataFromDatabases] = useState(false);

  const formCreateDatabase = useForm({
    initialValues: {
      databaseName: "",
    },
  });

  const formCreateTableau = useForm({
    initialValues: {
      tableauName: "",
    },
  });

  const formElementTableau = useForm({
    initialValues: {
      elementTableau: [{ name: "", key: randomId(), type: "string" }],
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
          {...formElementTableau.getInputProps(`elementTableau.${index}.typef`)}
          data={[
            { value: "number", label: "Number" },
            { value: "string", label: "String" },
          ]}
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

      for (const datazer in elData) {
        let th = datazer;
        let td = [];

        for (const el in elData[datazer]) {
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
              width: "fit-content",
              border: "1px solid #dee2e6",
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={() => handleGetDatabaseFull(`${url}/${th}`)}
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
      console.log("🚀 ~ file: index.js:116 ~ handleCreateDatabase ~ res", res);
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
      console.log(e.message);
    }
  };

  // POST CREATE TABLEAU
  const handleCreateTable = async () => {
    try {
      let dataTableauToSend = {};

      formElementTableau.values.elementTableau.map((el) => {
        dataTableauToSend[el.name] = { type: el.type, required: true };
      });

      const res = await axios.post(
        `http://localhost:8000/${databaseNameSelected}/${formCreateTableau.values.tableauName}`,
        dataTableauToSend
      );
      console.log("🚀 ~ file: index.js:202 ~ handleCreateTable ~ res", res);

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
      console.log(e.message);
    }
  };

  // GET avec params id ou autre et rajouter champ required
  // POST CREATE DATA /create
  const handleCreateDataInTable = async () => {
    try {
    } catch (e) {
      console.log(e.message);
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
    setDataFromDatabases(false);
  }, [databases]);

  useEffect(() => {
    setDataFromDatabases(false);
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
              sx={{ maxWidth: 300 }}
              style={{ marginTop: "25px", margin: "10px" }}
              mx="auto"
            >
              <form
                onSubmit={formCreateDatabase.onSubmit((values) => {
                  console.log(values);
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

        {active !== 999 && (
          <>
            <Box
              sx={{ maxWidth: 300 }}
              style={{ margin: "auto", marginBottom: "40px" }}
              mx="auto"
            >
              <form
                onSubmit={formCreateTableau.onSubmit((values) => {
                  console.log(values);
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
                    })
                  }
                  color="violet"
                >
                  ajouter un champ
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
                  width: "fit-content",
                  margin: "auto",
                  borderRadius: "25px",
                }}
              >
                <Code style={{ background: "white" }} block mt={5}>
                  {JSON.stringify(dataFromDatabase, null, 2)}
                </Code>
              </div>
            )}
          </>
        )}
      </AppShell>
    </div>
  );
}
