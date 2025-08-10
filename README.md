# Autism-Prediction-using-Machine-Learning
ASD Prediction Project
Project Overview
This project focuses on building a classification model to predict Autism Spectrum Disorder (ASD) based on a dataset containing various scores and demographic information. The goal is to develop a model that can accurately identify individuals with ASD, with a particular focus on improving the detection rate for the minority class (individuals with ASD).

Dataset
The project uses a dataset loaded from /content/train.csv (assuming this is the path within the Colab environment or where the data is accessed). The dataset includes scoring on 10 different attributes (A1-A10), age, gender, ethnicity, jaundice history, family history of autism (austim), country of residence, prior app usage, a result score, age description, relation to the person completing the survey, and the target variable 'Class/ASD' (0 for No ASD, 1 for ASD).

Methodology
The project follows a standard machine learning pipeline:

Data Loading and Initial Understanding: Loading the data, checking its shape, inspecting the first and last rows, and examining data types and non-null values.
Data Cleaning and Preparation:
Handling missing/inconsistent values in 'ethnicity' and 'relation' by grouping them into an 'Others' category.
Correcting inconsistent country names.
Converting the 'age' column to integer type.
Dropping irrelevant columns ('ID', 'age_desc').
Exploratory Data Analysis (EDA):
Analyzing the distribution of numerical and categorical features using histograms, box plots, and count plots.
Identifying and quantifying outliers in numerical columns ('age', 'result').
Checking the distribution of the target variable and identifying class imbalance.
Handling Outliers: Replacing outliers in 'age' and 'result' with the median value using the IQR method.
Label Encoding: Converting categorical features into numerical representations using Label Encoding.
Correlation Analysis: Visualizing the correlation matrix to understand relationships between features.
Train-Test Split: Splitting the data into training and testing sets (80% train, 20% test).
Handling Class Imbalance: Applying SMOTE (Synthetic Minority Oversampling Technique) to the training data to balance the distribution of the target variable.
Model Training and Evaluation:
Training and evaluating several classification models including Decision Tree, Random Forest, XGBoost, and Logistic Regression.
Performing hyperparameter tuning using RandomizedSearchCV to optimize model performance.
Model Selection: Comparing the performance of different models based on accuracy, precision, recall, and F1-score on the test set, with a focus on the minority class (ASD).
Building a Predictive System: Creating a Python function that takes new data, applies the necessary preprocessing steps (using saved encoders and median values), and uses the best-performing model to make predictions.
Results
After training and tuning several models, the Tuned Logistic Regression model achieved the best performance on the test set, particularly in identifying the minority class (ASD).

Metric	Tuned Logistic Regression	Default Random Forest	Default Logistic Regression	LightGBM
Overall Accuracy	0.844	0.819	0.831	0.800
Class 0 F1-score	0.89	0.88	0.88	0.87
Class 1 Precision	0.60	0.59	0.59	0.55
Class 1 Recall	0.89	0.64	0.83	0.64
Class 1 F1-score	0.72	0.61	0.69	0.59
Class 1 False Negatives	4	13	6	13
The tuned Logistic Regression model demonstrated a strong recall of 0.89 and an F1-score of 0.72 for the ASD class, effectively reducing the number of false negatives.

Files
[Your_Notebook_Name].ipynb: The main Colab notebook containing all the code for data preprocessing, EDA, modeling, and evaluation.
best_model.pkl: The saved pickle file of the best-performing model (Tuned Logistic Regression).
encoder.pkl: The saved pickle file containing the Label Encoders used for transforming categorical features.
train.csv: The dataset used for training and evaluation (needs to be available in the environment or linked from Drive).
How to Run the Code
Clone the GitHub repository to your local machine or open the .ipynb file directly in Google Colab (using the "Open in Colab" badge if you included it).
Ensure the train.csv dataset is accessible in the Colab environment (e.g., uploaded or mounted from Google Drive).
Run the cells sequentially in the notebook.
The predict_asd function can be used with new data after running the necessary cells to load the model and encoders.
Future Enhancements
Explore other advanced models and ensemble techniques.
Perform more extensive hyperparameter tuning.
Implement cross-validation during hyperparameter tuning for more robust evaluation.
Build a user interface (web application or app) to easily use the predictive system.
