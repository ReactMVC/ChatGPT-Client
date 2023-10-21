import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    retrieveMessages();
  }, []);

  useEffect(() => {
    storeMessages(messages);
  }, [messages]);

  const retrieveMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      if (storedMessages !== null) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve messages');
    }
  };

  const storeMessages = async (messages) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      Alert.alert('Error', 'Failed to store messages');
    }
  };

  const onSend = async (newMessages = []) => {
    if (newMessages[0].text.trim() === '') {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    setIsLoading(true);
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    try {
      const response = await fetch('https://chatgpt-api3.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ text: newMessages[0].text }),
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = {
          _id: Math.random().toString(36).substring(7),
          text: data.message,
          createdAt: new Date().toISOString(),
          user: {
            _id: 2,
            name: 'ChatGPT',
          },
        };
        setIsLoading(false);
        setMessages(previousMessages => GiftedChat.append(previousMessages, botResponse));
      } else {
        throw new Error('Failed to get response from chatbot');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
      const errorMessage = {
        _id: Math.random().toString(36).substring(7),
        text: 'Failed to send message. Please try again.',
        createdAt: new Date().toISOString(),
        user: {
          _id: 2,
          name: 'ChatGPT',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, errorMessage));
    }
  };

  const deleteChat = async () => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('messages');
              setMessages([]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete chat');
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee' />
      </View>
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <ActivityIndicator size='small' color='#6646ee' />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
        timeTextStyle={{
          right: {
            color: 'rgba(255,255,255,0.5)',
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat GPT</Text>
        <TouchableOpacity onPress={deleteChat}>
          <Icon name="trash-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderSend={isLoading ? renderSend : null}
        renderLoading={renderLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});