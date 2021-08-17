from flask import Flask, request
from flask_restx import Resource, Api
import Recc_System.ToVector as RC

df = RC.calculate_vector_Recipe(RC.dfmaking()) # preprocessing
#print(get_recommend_by_userVector(df, np.array(Recipe_cate_ingre_vector[373]) , [0,1,2,3,4,5,100],top=20).id) #input = instead of np.array(...), userVector 
#print(RC.get_recommend_by_userVector(df,  [5394,5657,5797,5842,5406],top=20))

app = Flask(__name__)
@app.route('/recc', methods=['POST'])
def recc():
    input_data = request.get_json()
    print(input_data['id'])
    print(input_data['like'])
    #return(input_data)
    return (RC.get_recommend_by_userVector(df,  input_data, top=20))

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3001)