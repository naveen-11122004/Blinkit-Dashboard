import pandas as pd
import json

def clean_and_aggregate():
    # Load dataset
    df = pd.read_excel('BlinkIT Grocery Data.xlsx')
    
    # 1. Data Cleaning
    # Let's inspect unique values of Item Fat Content before cleaning
    print("Original Fat Content values:", df['Item Fat Content'].unique())
    
    # Normalize Item Fat Content
    df['Item Fat Content'] = df['Item Fat Content'].replace({
        'LF': 'Low Fat',
        'low fat': 'Low Fat',
        'reg': 'Regular'
    })
    print("Cleaned Fat Content values:", df['Item Fat Content'].unique())
    
    # Handle Outlet Size null/blank values if any
    print("Original Outlet Size values:", df['Outlet Size'].unique())
    # In some datasets, Outlet Size has 'Medium', 'Small', 'High' or nulls. Let's fill nulls or keep as 'Unknown'
    df['Outlet Size'] = df['Outlet Size'].fillna('Unknown')
    # If there are empty strings or spaces, replace them
    df['Outlet Size'] = df['Outlet Size'].replace({' ': 'Unknown', '': 'Unknown'})
    
    # Calculate overall KPIs
    total_sales = float(df['Sales'].sum())
    avg_sales = float(df['Sales'].mean())
    num_items = int(df.shape[0])
    avg_rating = float(df['Rating'].mean())
    
    print(f"Total Sales: {total_sales}")
    print(f"Avg Sales: {avg_sales}")
    print(f"Num Items: {num_items}")
    print(f"Avg Rating: {avg_rating}")
    
    # 2. Aggregations for charts
    
    # Sales by Fat Content
    fat_content_data = df.groupby('Item Fat Content').agg(
        Total_Sales=('Sales', 'sum'),
        Avg_Sales=('Sales', 'mean'),
        Num_Items=('Item Identifier', 'count'),
        Avg_Rating=('Rating', 'mean')
    ).reset_index().to_dict(orient='records')
    
    # Sales by Item Type
    item_type_data = df.groupby('Item Type').agg(
        Total_Sales=('Sales', 'sum'),
        Avg_Sales=('Sales', 'mean'),
        Num_Items=('Item Identifier', 'count'),
        Avg_Rating=('Rating', 'mean')
    ).reset_index().sort_values(by='Total_Sales', ascending=False).to_dict(orient='records')
    
    # Sales by Outlet Establishment Year
    establishment_data = df.groupby('Outlet Establishment Year').agg(
        Total_Sales=('Sales', 'sum'),
        Avg_Sales=('Sales', 'mean'),
        Num_Items=('Item Identifier', 'count'),
        Avg_Rating=('Rating', 'mean')
    ).reset_index().sort_values(by='Outlet Establishment Year').to_dict(orient='records')
    
    # Sales by Outlet Size
    outlet_size_data = df.groupby('Outlet Size').agg(
        Total_Sales=('Sales', 'sum'),
        Avg_Sales=('Sales', 'mean'),
        Num_Items=('Item Identifier', 'count'),
        Avg_Rating=('Rating', 'mean')
    ).reset_index().sort_values(by='Total_Sales', ascending=False).to_dict(orient='records')
    
    # Sales by Outlet Location Type
    location_data = df.groupby('Outlet Location Type').agg(
        Total_Sales=('Sales', 'sum'),
        Avg_Sales=('Sales', 'mean'),
        Num_Items=('Item Identifier', 'count'),
        Avg_Rating=('Rating', 'mean')
    ).reset_index().sort_values(by='Outlet Location Type').to_dict(orient='records')
    
    # Sales by Outlet Type
    outlet_type_data = df.groupby('Outlet Type').agg(
        Total_Sales=('Sales', 'sum'),
        Avg_Sales=('Sales', 'mean'),
        Num_Items=('Item Identifier', 'count'),
        Avg_Rating=('Rating', 'mean')
    ).reset_index().sort_values(by='Total_Sales', ascending=False).to_dict(orient='records')
    
    # Let's save the cleaned data as a JSON file for our web app
    # We will export the full cleaned dataset so the user can filter dynamically in the web app
    full_data = df.to_dict(orient='records')
    
    dashboard_data = {
        "kpis": {
            "total_sales": total_sales,
            "avg_sales": avg_sales,
            "num_items": num_items,
            "avg_rating": avg_rating
        },
        "fat_content": fat_content_data,
        "item_types": item_type_data,
        "establishment_years": establishment_data,
        "outlet_sizes": outlet_size_data,
        "location_types": location_data,
        "outlet_types": outlet_type_data,
        "raw_records": full_data
    }
    
    with open('dashboard_data.json', 'w') as f:
        json.dump(dashboard_data, f, indent=2)
        
    print("Saved dashboard_data.json successfully!")

if __name__ == '__main__':
    clean_and_aggregate()
