import { View, StyleSheet,Text } from 'react-native';
import { Task } from '../models/Task';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

// Definieren Sie die Props für die TaskItem-Komponente
interface TaskItemProps {
    task: Task;
  }
  
  const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    return (
      <View style={styles.taskItem}>
        <Icon name="document-text-outline" size={30} color="#4B9CD3" />
        <View style={styles.taskDetails}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDate}>{task.dueDate}</Text>
        </View>
        <Icon name="ellipsis-vertical" size={20} color="#4B9CD3" />
      </View>
    );
  };

  export default TaskItem

  const styles = StyleSheet.create({
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 6,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    taskDetails: {
      marginLeft: 10,
      flex: 1,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333333',
    },
    taskDate: {
      fontSize: 14,
      color: '#666666',
    },
  });