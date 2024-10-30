import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';  // Importando axios para fazer requisições
import { Button } from 'react-native-paper';  // Usando o botão estilizado do react-native-paper

export default function App() {
  const [cartas, setCartas] = useState([]); // Estado para armazenar as cartas puxadas
  const [carregando, setCarregando] = useState(true);
  const [baralhoId, setBaralhoId] = useState(null); // Estado para armazenar o ID do baralho

  // Função para criar e baralhar um novo baralho
  const criarBaralho = async () => {
    setCarregando(true);
    try {
      const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      setBaralhoId(response.data.deck_id);  // Armazena o ID do baralho
      puxarCartas(response.data.deck_id);  // Puxa as primeiras cartas do baralho
    } catch (error) {
      console.error(error);
      setCarregando(false);
    }
  };

  // Função para puxar cartas
  const puxarCartas = async (id) => {
    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`);
      setCartas(response.data.cards);  // Armazena as cartas recebidas
      setCarregando(false);
    } catch (error) {
      console.error(error);
      setCarregando(false);
    }
  };

  useEffect(() => {
    criarBaralho();  // Cria e baralha o baralho quando o app é montado
  }, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cartas.length > 0 && (
        <View style={styles.cartasContainer}>
          {cartas.map((carta, index) => (
            <View key={index} style={styles.carta}>
              <Image source={{ uri: carta.image }} style={styles.cartaImagem} />
              <Text>{carta.value} de {carta.suit}</Text>
            </View>
          ))}
        </View>
      )}
      <Button
        mode="contained"
        onPress={() => puxarCartas(baralhoId)}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Embaralhar Cartas
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'green',
  },
  cartasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  carta: {
    alignItems: 'center',
  },
  cartaImagem: {
    width: 100,
    height: 150,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'red',
  },
  buttonContent: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});
