import { Sliders } from 'lucide-react';
import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react'

function Dashboard() {
    const [minValue, setMinValue] = useState(-100);
    const [maxValue, setMaxValue] = useState(100);
    const [arraySize, setArraySize] = useState(10);
    const [problemStarted, setProblemStarted] = useState(false);
    const [unsortedList, setUnsortedList] = useState<number[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('java');
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(false);
    const [executionTime, setExecutionTime] = useState(null);
    const [currentSubmission, setCurrentSubmission] = useState<number[] | null>(null);

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
                    Min Value:
                    <input type="number" value={minValue} onChange={(e) => setMinValue(Number(e.target.value))} />
                </label>
                <label>
                    Max Value:
                    <input type="number" value={maxValue} onChange={(e) => setMaxValue(Number(e.target.value))} />
                </label>
                <label>
                    Array Size:
                    <input type="range" min="2" max="100" value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} />
                    <p>{arraySize}</p>
                </label>
                <label>
                    Programming Language:
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="csharp">C#</option>
                        <option value="cpp">C++</option>
                        <option value="go">Go</option>
                    </select>
                    <p>Selected: {selectedLanguage}</p>
                </label>
                <button 
                    onClick={handleStart}
                    disabled={minValue >= maxValue}>
                        Start
                </button>
                <div>
                    <p>Unsorted List: {unsortedList.join(', ')}</p>
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
