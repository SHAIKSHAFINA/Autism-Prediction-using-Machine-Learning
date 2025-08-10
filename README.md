# Autism-Prediction-using-Machine-Learning


##  Overview

This project focuses on building a **classification model** to predict **Autism Spectrum Disorder (ASD)** using a dataset containing various scores and demographic details.
The primary goal is to **accurately detect individuals with ASD**, with special emphasis on improving detection rates for the **minority class (ASD cases)**.


## 📂 Dataset

* **File:** `/content/train.csv` 
* **Features:**

  * **Scoring Attributes:** `A1`–`A10`
  * **Demographics:** `age`, `gender`, `ethnicity`, `country_of_residence`
  * **Medical History:** `jaundice`, `family history of autism (austim)`
  * **Other:** prior app usage, result score, relation to survey responder
  * **Target:** `Class/ASD` (0 = No ASD, 1 = ASD)


## 🔄 Methodology

### 1️⃣ Data Loading & Understanding

* Load dataset and inspect shape, data types, and missing values.

### 2️⃣ Data Cleaning & Preparation

* Handle missing/inconsistent values (`ethnicity`, `relation`) → group as `"Others"`.
* Fix inconsistent country names.
* Convert `age` to integer.
* Drop irrelevant columns: `ID`, `age_desc`.

### 3️⃣ Exploratory Data Analysis (EDA)

* Visualize numerical & categorical features (histograms, box plots, count plots).
* Identify outliers in `age` and `result`.
* Analyze target variable distribution → found **class imbalance**.

### 4️⃣ Outlier Handling

* Replace outliers in `age` and `result` using **IQR method** and median replacement.

### 5️⃣ Feature Encoding

* Apply **Label Encoding** for categorical variables.

### 6️⃣ Correlation Analysis

* Plot correlation matrix to understand feature relationships.

### 7️⃣ Train-Test Split

* **80% training** | **20% testing**.

### 8️⃣ Handling Class Imbalance

* Apply **SMOTE (Synthetic Minority Oversampling Technique)** to training set.

### 9️⃣ Model Training & Evaluation

* Models used:

  * Decision Tree
  * Random Forest
  * XGBoost
  * Logistic Regression
* **Hyperparameter tuning** with `RandomizedSearchCV`.
* Compare performance based on **accuracy, precision, recall, and F1-score**.

### 🔟 Predictive System

* `predict_asd` function:

  * Preprocesses new data (using saved encoders & median values)
  * Predicts ASD using **best model**.



## 📁 Files

* **`ASD_Prediction.ipynb`** → Main Colab notebook (preprocessing, EDA, modeling, evaluation)
* **`best_model.pkl`** → Saved Tuned Logistic Regression model
* **`encoder.pkl`** → Label Encoders for categorical features
* **`train.csv`** → Dataset


## ▶ How to Run

1. **Open in Google Colab** (or clone the repository locally).
2. Ensure `train.csv` is available.
3. Run notebook cells sequentially.
4. Use `predict_asd` function for new predictions.

