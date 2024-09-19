import re
import requests
from bs4 import BeautifulSoup

def scrape_kmit_homepage(url="https://www.kmit.in/index.php"):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    result = ""

    introDiv = soup.find('div', class_='col-md-5')
    result += introDiv.find('p').get_text() + "\n"
    
    whyDiv = soup.find('div', class_='col-md-12')
    result += whyDiv.find('p').get_text() + "\n"
    
    overlayDiv = soup.find_all('div', class_='card-body text-center')
    
    for div in overlayDiv:
        text = div.find('p').get_text().strip()

        normalized_text = re.sub(r'\s+', ' ', text)

        result += normalized_text + "\n"
    
    return result

def scrape_achievements_table(url="https://www.kmit.in/aboutus/aboutus.php"):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    achievements_section = soup.find('div', id='achievements')
    
    table = achievements_section.find('table', class_='table table-striped custom')
    
    achievements = []
    
    rows = table.find_all('tr')[1:]
    
    for row in rows:
        cells = row.find_all('td')
        
        if len(cells) == 3:
            achievement = {
                'S.No': cells[0].get_text(strip=True),
                'Year(s)': cells[1].get_text(strip=True),
                'Details': cells[2].get_text(strip=True)
            }
            achievements.append(achievement)
    
    return achievements

def scrape_kmit_aboutus(url="https://www.kmit.in/aboutus/aboutus.php"):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    result = ""

    tab_content = soup.find('div', class_='tab-content')

    for section in tab_content.find_all('div', class_='tab-pane'):
        section_id = section.get('id').capitalize()
        if section_id == 'Visionandmission':
            section_id = 'Vision and Mission'    
        elif section_id == 'Qualitypolicy':
            section_id = 'Quality Policy'
        elif section_id == 'Corevalues':
            section_id = 'Core Values'
            
        if section_id == 'Accreditions':
            continue
        
        if section_id == 'Achievements':
            achievements = scrape_achievements_table()
            result += f"{section_id}\n"
            for achievement in achievements:
                result += f"{achievement['S.No']}. {achievement['Year(s)']}: {achievement['Details']}\n"
            result += "\n"
            continue
            
        result += f"{section_id}\n"
        
        content = section.find_all('p')
        for para in content:
            result += para.get_text().strip() + "\n"

        result += "\n"  

    return result

def scrape_kmit_management(url="https://www.kmit.in/administration/kmes.php"):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    result = ""
    
    kmesDiv = soup.find('div', class_='background')
    result += kmesDiv.find('p').get_text() + "\n"
    
    response = requests.get("https://www.kmit.in/administration/management.php")
    soup = BeautifulSoup(response.text, 'html.parser')
    
    president_tab = soup.find('div', id='president')
    if president_tab:
        result += "Shri. L Narasimha Reddy is the president of KMIT.\n"
        about_president = president_tab.find('p').get_text(strip=True)
        result += "About the President:\n" + about_president + "\n\n"
    
    founder_tab = soup.find('div', id='founder')
    if founder_tab:
        result += "Mr. Neil Gogte is the founder of KMIT.\n"
        about_founder = founder_tab.find_all('p')
        result += "About the Founder:\n"
        for para in about_founder:
            result += para.get_text(strip=True) + "\n"
        result += "\n"
        
        founder_message = founder_tab.find('blockquote', class_='otro-blockquote')
        if founder_message:
            result += "Founder's Message:\n" + founder_message.get_text(strip=True) + "\n\n"
    
    director_tab = soup.find('div', id='director')
    if director_tab:
        result += "Mr. Nitin Sahasrabudhe is the director of KMIT.\n"
        about_director = director_tab.find('p').get_text(strip=True)
        result += "About the Director:\n" + about_director + "\n\n"
        
        director_message = director_tab.find('blockquote', class_='otro-blockquote')
        if director_message:
            result += "Director's Message:\n" + director_message.get_text(strip=True) + "\n\n"

    return result

def scrape_kmit_principal_academic_director(url="https://www.kmit.in/administration/principal.php"):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    result = ""
    
    principalDiv = soup.find('div', class_='col-sm-9')
    result += "Dr. B L Malleswari is the principal of KMIT.\n"
    about_principal = principalDiv.find('p').get_text(strip=True)
    result += "About the Principal:\n" + about_principal + "\n\n"
    
    response = requests.get("https://www.kmit.in/administration/academicdirector.php")
    soup = BeautifulSoup(response.text, 'html.parser')
    
    academic_directorDiv = soup.find('div', class_='col-sm-9')
    result += "Deepa Ganu is the academic director of KMIT.\n"
    about_academic_director = academic_directorDiv.find('p').get_text(strip=True)
    result += "About the Academic Director:\n" + about_academic_director + "\n\n"
    
    return result

def scrape_kmit_placements(url="https://www.kmit.in/placements/placement.php"):
    response = requests.get(url)

    soup = BeautifulSoup(response.content, 'html.parser')
    placement_data = soup.find('p',style="color:#155724").get_text(separator="\n", strip=True)
    
    return placement_data
 
print(scrape_kmit_placements())