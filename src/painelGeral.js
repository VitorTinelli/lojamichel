import { useEffect, useState } from "react";
import Header from "./modules/header.js";
import supabase from "./supabase.js"
import Footer from "./modules/footer.js";
import styled from 'styled-components'
import { Chart } from "react-google-charts";
import "./index.js";
import { insertMaskInCpf } from "./mascaras/cpf.ts";
import { insertMaskInPhone } from "./mascaras/phone.ts";
const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

const Grafico = styled.div`
    max-width: 80vw;
    margin: auto;
    padding: 20px;
    display: flex;
    justify-content: space-around
`;

export const options = {
    title: "Maiores interesses",
    is3D: true,
};

export const options2 = {
    title: "Clientes cadastrados nos últimos 3 meses",
};

export default function PainelGeral() {
    const [clientes, setClientes] = useState([])
    const [chartData, setChartData] = useState([["Interesses", "Quantidade"]]);
    const [chartData2 , setChartData2] = useState([["Data", "Quantidade", { role: "style" }]]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const { data, error } = await supabase
                    .from("clientes")
                    .select("id, nome, cpf, rua, bairro, cidade, estado, nres, aniversario, ap, celular, created_at");
                if (error) {
                    throw error;
                }
                const chartData2 = data.reduce((acc, cliente) => {
                    const data = new Date(cliente.created_at);
                    const month = data.getMonth() + 1;
                    const year = data.getFullYear();
                    const label = `${month}/${year}`;
                    const index = acc.findIndex(([name]) => name === label);
                    if (index === -1) {
                        acc.push([label, 1, "#0099C6"]);
                    } else {
                        acc[index][1]++;
                    }
                    return acc;
                }, [["Data", "Quantidade", { role: "style" }]]);
                setChartData2(chartData2);
                setClientes(data.reverse());
            } catch (error) {
                console.error("Erro ao buscar clientes:", error.message);
            }
        };

        const fetchInteresses = async () => {
            try {
                const { data, error } = await supabase
                    .from("interesses")
                    .select("id, interesse");
                if (error) {
                    throw error;
                }
                const chartData = data.reduce((acc, interesse) => {
                    const index = acc.findIndex(([name]) => name === interesse.interesse);
                    if (index === -1) {
                        acc.push([interesse.interesse, 1]);
                    } else {
                        acc[index][1]++;
                    }
                    return acc;
                }, [["Interesses", "Quantidade"]]); 
                setChartData(chartData);
            } catch (error) {
                console.error("Erro ao buscar interesses:", error.message);
            }
        }
        fetchInteresses();
        fetchClientes();
    }, []);

    return (
        <main>
            <>
                <Header />
                <main>
                    <Grafico>
                        <Chart
                            chartType="PieChart"
                            data={chartData}
                            options={options}
                            width={"100%"}
                            height={"400px"}
                        />
                        <Chart
                            chartType="ColumnChart"
                            width="100%"
                            height="400px"
                            options={options2}
                            data={chartData2}
                        />
                    </Grafico>
                    <h2 className="page-title">Últimos cadastros:</h2>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Endereço</th>
                                <th>Cidade</th>
                                <th>Celular</th>
                                <th>Aniversário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes
                                .slice(0, 5)
                                .map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nome}</td>
                                        <td>{insertMaskInCpf(cliente.cpf)}</td>
                                        <td>{cliente.rua}, {cliente.nres} - {cliente.bairro} {cliente.ap}</td>
                                        <td>{cliente.cidade}, {cliente.estado}</td>
                                        <td>{insertMaskInPhone(cliente.celular)}</td>
                                        <td>{formatter.format(new Date(cliente.aniversario))}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </main>
                <Footer />
            </>
        </main>
    )
}