import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const FillInTheBlanksGame = () => {
  // Sample questions with blanks
  const questions = [
    {
      sentence: 'I ___ to school every day.',
      answer: 'go',
      options: ['go', 'went', 'going', 'gone'],
      blankIndex: 2,
    },
    {
      sentence: 'She ___ a book right now.',
      answer: 'is reading',
      options: ['reads', 'is reading', 'read', 'has read'],
      blankIndex: 4,
    },
    {
      sentence: 'They ___ football yesterday.',
      answer: 'played',
      options: ['play', 'plays', 'played', 'playing'],
      blankIndex: 3,
    },
    {
      sentence: 'We ___ never ___ to Paris.',
      answer: 'have been',
      options: ['have been', 'has been', 'had been', 'are being'],
      blankIndices: [2, 4], // For multiple blanks
    },
    {
      sentence: 'The cat ___ on the sofa.',
      answer: 'is sleeping',
      options: ['sleeps', 'is sleeping', 'slept', 'sleep'],
      blankIndex: 3,
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Split sentence for display with blanks
  const renderSentenceWithBlanks = () => {
    const question = questions[currentQuestionIndex];

    if (question.blankIndices) {
      // Handle multiple blanks
      const parts = question.sentence.split(' ');
      return parts.map((part, index) => {
        if (question.blankIndices.includes(index)) {
          return (
            <Text key={index} style={styles.blank}>
              {selectedOption || '______'}
            </Text>
          );
        }
        return <Text key={index}> {part} </Text>;
      });
    } else {
      // Handle single blank
      const parts = question.sentence.split(' ');
      return parts.map((part, index) => {
        if (index === question.blankIndex) {
          return (
            <Text key={index} style={styles.blank}>
              {selectedOption || '______'}
            </Text>
          );
        }
        return <Text key={index}> {part} </Text>;
      });
    }
  };

  const handleCheckAnswer = () => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    const isCorrect =
      userAnswer.toLowerCase() === correctAnswer.toLowerCase() ||
      selectedOption === correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      Alert.alert('Correct!', 'Great job! Your answer is correct.', [
        {
          text: 'Next',
          onPress: () => {
            goToNextQuestion();
          },
        },
      ]);
    } else {
      Alert.alert(
        'Incorrect',
        `Your answer: "${
          userAnswer || selectedOption
        }"\nCorrect answer: "${correctAnswer}"`,
        [{text: 'Try Again', onPress: resetCurrentQuestion}],
      );
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetCurrentQuestion();
    } else {
      Alert.alert(
        'Game Over',
        `You completed all questions! Final score: ${score + 1}/${
          questions.length
        }`,
        [
          {
            text: 'Play Again',
            onPress: () => {
              setCurrentQuestionIndex(0);
              setScore(0);
              resetCurrentQuestion();
            },
          },
        ],
      );
    }
  };

  const resetCurrentQuestion = () => {
    setUserAnswer('');
    setSelectedOption(null);
    setShowOptions(false);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fill in the Blanks</Text>
      <Text style={styles.score}>
        Score: {score}/{questions.length}
      </Text>

      <Text style={styles.instruction}>
        Complete the sentence with the correct word:
      </Text>

      {/* Display sentence with blanks */}
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentenceText}>{renderSentenceWithBlanks()}</Text>
      </View>

      {/* Input for manual answer */}
      <TextInput
        style={styles.input}
        placeholder="Type your answer here"
        value={userAnswer}
        onChangeText={setUserAnswer}
        onSubmitEditing={handleCheckAnswer}
      />

      {/* Or choose from options */}
      <TouchableOpacity style={styles.optionsButton} onPress={toggleOptions}>
        <Text style={styles.optionsButtonText}>
          {showOptions ? 'Hide Options' : 'Show Options'}
        </Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => selectOption(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Check answer button */}
      <TouchableOpacity
        style={styles.checkButton}
        onPress={handleCheckAnswer}
        disabled={!userAnswer && !selectedOption}>
        <Text style={styles.checkButtonText}>Check Answer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  score: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    color: '#444',
    textAlign: 'center',
  },
  sentenceContainer: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sentenceText: {
    fontSize: 18,
    lineHeight: 30,
  },
  blank: {
    fontWeight: 'bold',
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  optionsButton: {
    height: 50,
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  optionsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    height: 150,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    minWidth: 80,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
  },
  checkButton: {
    height: 50,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FillInTheBlanksGame;
