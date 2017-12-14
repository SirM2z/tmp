''' csdn spider '''

import requests
from bs4 import BeautifulSoup

def start():
    ''' start def '''
    root_url = 'http://blog.csdn.net'
    strat_url = 'http://blog.csdn.net/sirm2z'
    list_params = {'pageindex': 1, 'pagesize': 100, 'categoryId':0}
    list_url = 'http://blog.csdn.net/sirm2z/svc/getarticles'
    start_views = 0
    end_views = 0
    success_num = 0
    err_num = 0
    response = requests.get(strat_url, timeout=5)
    soup = BeautifulSoup(response.content, "html5lib")
    start_views = soup.find("span", class_='num').string
    print('当前访问量：%s' % start_views)
    print('---------------------------------------')
    list_re = requests.get(list_url, params=list_params, timeout=5)
    list_soup = BeautifulSoup(list_re.content, "html5lib")
    list_li = list_soup.find_all('li', class_='blog-unit')
    for item in list_li:
        url = root_url + item.find('h3').find('a').attrs['href']
        item_re = requests.get(url, timeout=5)
        item_soup = BeautifulSoup(item_re.content, "html5lib")
        title = item_soup.find('h1', class_='csdn_top').string
        print('我已经来到-%s' % title)
        success_num += 1
    result = requests.get(strat_url, timeout=5)
    result_soup = BeautifulSoup(result.content, "html5lib")
    end_views = result_soup.find("span", class_='num').string
    print('---------------------------------------')
    print('文章总数目：%s' % len(list_li))
    print('成功访问量：%s' % success_num)
    print('失败访问量：%s' % err_num)
    print('当前访问量：%s' % end_views)
    print('本次访问量增加了：%d' % (int(end_views.replace(',', '')) - int(start_views.replace(',', ''))))
    print('---------------------------------------')
    print('end')
    # print(start_views.string.replace(',', ''))

print('开始启动爬虫-csdn')
start()
