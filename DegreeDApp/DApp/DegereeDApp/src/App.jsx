import { BrowserProvider, Contract } from "ethers";
import { useState } from "react";
import { abi, contractAddress } from "./Cert.json";
function App() {
  const styles = {
    container: {
      width: "60%",
      margin: "20px auto",
      padding: "20px",
      border: "8px solid #004080",
      borderRadius: "10px",
      backgroundColor: "#f8f9fa",
      fontFamily: "'Times New Roman', Times, serif",
      textAlign: "center",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#004080",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    header: {
      color: "#004080",
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    subHeader: {
      fontSize: "18px",
      margin: "10px 0",
      color: "#333",
    },
    name: {
      fontSize: "28px",
      fontWeight: "bold",
      margin: "20px 0",
      color: "#004080",
      textDecoration: "underline",
    },
    degree: {
      fontSize: "22px",
      margin: "15px 0",
      color: "#555",
    },
    grade: {
      fontSize: "20px",
      margin: "10px 0",
      color: "#333",
    },
    date: {
      fontSize: "18px",
      margin: "15px 0",
      color: "#777",
    },
    footer: {
      marginTop: "20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#004080",
    },
  };

  const [output, setOutput] = useState("");
  const [queryId, setQueryId] = useState("");
  const [data, setData] = useState({
    id: 0,
    name: "",
    degree: "",
    grade: "",
    date: "",
  });

  const provider = new BrowserProvider(window.ethereum);

  const connectMetamask = async () => {
    const signer = await provider.getSigner();
    alert(`Connected to metamask with address: ${signer.address}`);
  };
  
  const resetData = () => {
    setData({
      id: 0,
      name: "",
      degree: "",
      grade: "",
      date: "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contractInstance = new Contract(contractAddress, abi, signer);

      const txn = await contractInstance.issue(
        data.id,
        data.name,
        data.degree,
        data.grade,
        data.date
      );
      console.log(`Transaction hash is ${txn.hash}`);
    } catch (error) {
      alert(error.message);
    }
  };
  const getCertificate = async () => {
    const signer = await provider.getSigner();
    const contractInstance = new Contract(contractAddress, abi, signer);

    const result = await contractInstance.Certificates(queryId);

    if (result[0]) {
      setOutput(result.toString());
    } else {
      setOutput("Certificate not found");
    }
  };
  const downloadPDF = () => {
    const certificate = document.createElement("div");
    certificate.style.fontFamily = "'Times New Roman', Times, serif";
    certificate.style.textAlign = "center";
    certificate.style.width = "600px";
    certificate.style.margin = "0 auto";
    certificate.style.border = "8px solid #004080";
    certificate.style.borderRadius = "10px";
    certificate.style.padding = "20px";
    certificate.style.backgroundColor = "#f8f9fa";

    certificate.innerHTML = `
      <div style="color: #004080; font-size: 36px; font-weight: bold; margin-bottom: 10px;">
        Indian Institute of Technology Kanpur
      </div>
      <div style="font-size: 18px; margin: 10px 0; color: #333;">
        Certificate of Achievement
      </div>
      <div style="font-size: 28px; font-weight: bold; margin: 20px 0; color: #004080; text-decoration: underline;">
        ${output.split(",")[0]}
      </div>
      <div style="font-size: 22px; margin: 15px 0; color: #555;">
        ${output.split(",")[1]}
      </div>
      <div style="font-size: 20px; margin: 10px 0; color: #333;">
        Grade: ${output.split(",")[2]}
      </div>
      <div style="font-size: 18px; margin: 15px 0; color: #777;">
        Date of Issue: ${output.split(",")[3]}
      </div>
      <div style="margin-top: 20px; font-size: 16px; font-weight: bold; color: #004080;">
        "Excellence in Education and Innovation"
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<!DOCTYPE html><html><head><title>Certificate</title></head><body>${certificate.outerHTML}</body></html>`
    );
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        backgroundColor: "#242424",
      }}
    >
      <h1>Degree DApp IITK</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "#F4FFF8",
          color: "black",
          borderRadius: "10px",
          padding: "20px",
          minWidth: "50%",
          margin: "0 auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button onClick={connectMetamask}>Connect to Metamask</button>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "#F4FFF8",
          color: "black",
          borderRadius: "10px",
          padding: "20px",
          minWidth: "50%",
          margin: "0 auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label htmlFor="id">ID:</label>
          <input
            type="number"
            name="id"
            id="id"
            value={data.id}
            onChange={(e) => setData({ ...data, id: e.target.value })}
            style={{ padding: "10px" }}
          />
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            style={{ padding: "10px" }}
          />
          <label htmlFor="degree">Degree:</label>
          <input
            type="text"
            name="degree"
            id="degree"
            value={data.degree}
            onChange={(e) => setData({ ...data, degree: e.target.value })}
            style={{ padding: "10px" }}
          />
          <label htmlFor="grade">CPI:</label>
          <input
            type="text"
            name="grade"
            id="grade"
            value={data.grade}
            onChange={(e) => setData({ ...data, grade: e.target.value })}
            style={{ padding: "10px" }}
          />
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            name="date"
            id="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            style={{ padding: "10px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">Submit</button>
          <button type="button" onClick={resetData}>
            Reset
          </button>
        </div>
      </form>
      <hr />
      <h1>Query Certificate</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "#F4FFF8",
          color: "black",
          borderRadius: "10px",
          padding: "20px",
          minWidth: "50%",
          margin: "0 auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label htmlFor="id">ID:</label>
        <input
          type="number"
          name="id"
          id="id"
          value={queryId}
          onChange={(e) => setQueryId(e.target.value)}
          style={{ padding: "10px" }}
        />
        <button onClick={getCertificate}>Get Certificate</button>
      </div>

      {output.split(",")[2] ? (
        <div style={styles.container}>
          <div style={styles.header}>Indian Institute of Technology Kanpur</div>
          <div style={styles.subHeader}>Certificate of Achievement</div>
          <div style={styles.name}>{output.split(",")[0]}</div>
          <div style={styles.degree}>{output.split(",")[1]}</div>
          <div style={styles.grade}>CPI: {output.split(",")[2]}</div>
          <div style={styles.date}>Date of Issue: {output.split(",")[3]}</div>
          <div style={styles.footer}>
            "Excellence in Education and Innovation"
          </div>
          <button style={styles.button} onClick={downloadPDF}>
            Download Certificate as PDF
          </button>
        </div>
      ) : (
        <h1 style={{ textAlign: "center" }}>No certificate found</h1>
      )}
    </div>
  );
}

export default App;
