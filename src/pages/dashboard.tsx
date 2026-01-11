import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react'
import '../app.css'

function Dashboard() {
    const [minValue, setMinValue] = useState(-100);
    const [maxValue, setMaxValue] = useState(100);
    const [arraySize, setArraySize] = useState(10);
    const [problemStarted, setProblemStarted] = useState(false);
    const [unsortedList, setUnsortedList] = useState<number[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(false);
    const [executionTime, setExecutionTime] = useState(null);
    const [currentSubmission, setCurrentSubmission] = useState<number[] | null>(null);
    isSubmitting
    problemStarted

    const generateUnsortedList = () => {
        const list = [];
        for (let i = 0; i < arraySize; i++) {
            const randomNum = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
            list.push(randomNum);
        }
        setUnsortedList(list);
    };

    const languageTemplates = {
    javascript: `function sortArray(arr) {
                // Your sorting algorithm here
                // Return the sorted array
                return arr;
    }`,
    python: `def sort_array(arr):
    # Your sorting algorithm here
    # Return the sorted list
    return arr`,
    java: `public class Solution {
    public int[] sortArray(int[] arr) {
        // Your sorting algorithm here
        // Return the sorted array
        return arr;
    }
}`,
    cpp: `#include <vector>
using namespace std;

vector<int> sortArray(vector<int> arr) {
    // Your sorting algorithm here
    // Return the sorted vector
    return arr;
}`,
    csharp: `using System;

public class Solution {
    public int[] SortArray(int[] arr) {
        // Your sorting algorithm here
        // Return the sorted array
        return arr;
    }
}`,
    go: `package main

func sortArray(arr []int) []int {
    // Your sorting algorithm here
    // Return the sorted slice
    return arr
}`
    };

    const monacoLanguageMap = {
        java: 'java',
        python: 'python',
        javascript: 'javascript',
        csharp: 'csharp',
    };

    const usList = () => {
        if (!problemStarted) {
            return <p></p>;
        } else {
            return <p>Unsorted List: {unsortedList.join(', ')}</p>;
        }          
    }

    const langWarning = () => { 
        if (selectedLanguage !== 'Python') {
            return <p style={{ fontSize: '140%', fontWeight: 'bold' }}>
                    <span style={{ color: 'red' }}>WARNING:</span>{' '}
                    Only python is supported for now.
                    </p>
        } else {
            return null;
        }
    }

    useEffect(() => {
        setCode(languageTemplates[selectedLanguage as keyof typeof languageTemplates]);
    }, [selectedLanguage]);

    const handleStart = () => {
        generateUnsortedList();
        setCode(languageTemplates[selectedLanguage as keyof typeof languageTemplates]);
        setResult(false);
        setExecutionTime(null);
        setProblemStarted(true);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setResult(false);
        setExecutionTime(null);

        try {
            const response = await fetch('https://w0vs1neuw0.execute-api.us-west-2.amazonaws.com/api/submit-code', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    language: selectedLanguage,
                    test_array: unsortedList,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Submission failed');
            }

            const isSorted = data.sortedArray.every((val: number, index: number, arr: number[]) => {
                return index === 0 || arr[index - 1] <= val;
            });

            setCurrentSubmission(data.sortedArray);

            setResult(isSorted);
            setExecutionTime(data.executionTime);
            console.log(data);
        } catch (error) {
            setResult(false);
            console.log("Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="dashboard-container">
                <label>
                    Miniimum value: <input type="number" value={minValue} onChange={(e) => setMinValue(Number(e.target.value))} />
                </label>
                <label>
                    Maximum value: <input type="number" value={maxValue} onChange={(e) => setMaxValue(Number(e.target.value))} />
                </label>
                <label>
                    Array size: <input type="range" min="2" max="100" value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} /> {arraySize}
                </label>
                <p></p>
                <label>
                    Programming language:
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                        <option value="Python">Python</option>
                        <option value="Java">Java</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="CSharp">C#</option>
                        <option value="Cpp">C++</option>
                        <option value="Go">Go</option>
                    </select>
                    <p>Selected language: {selectedLanguage}</p>
                    {langWarning()}
                </label>
                <button 
                    onClick={handleStart}
                    disabled={minValue >= maxValue}>
                        Start
                </button>
                <div>
                    {usList()}
                </div>
                <Editor
                    height="500px"
                    defaultLanguage="java"
                    language={monacoLanguageMap[selectedLanguage as keyof typeof monacoLanguageMap]}
                    defaultValue="// Write your sorting algorithm here"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                />
                <button onClick={handleSubmit}>
                    Run and Submit
                </button>
                <p>
                    Success?: {result ? 'Yes' : 'No'}
                </p>
                <p>
                    Execution Time: {executionTime !== null ? `${executionTime} ms` : 'N/A'}
                </p>
                <p>
                    Current Submission: {currentSubmission ? currentSubmission.join(', ') : 'N/A'}
                </p>

            </div>  
        </>
    )
}

export default Dashboard;
