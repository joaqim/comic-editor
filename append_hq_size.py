#!/usr/bin/env python3
import json
import argparse

from pathlib import Path
from PIL import Image

class MyImage:
    def __init__(self, data):
        self.w = data['img_size'][0];
        self.h = data['img_size'][1];


class Rect:
    def __init__(self, x=0, y=0, width=0, height=0, data=None, img_data=None, img=None):
        if data is not None:
            self.x = data['x'];
            self.x = data['y'];
            self.w = data['width'];
            self.h = data['height'];
        if img_data is not None:
            self.x = 0;
            self.x = 0;
            self.w = img_data['img_size'][0];
            self.h = img_data['img_size'][1];
        elif img is not None:
            self.x = 0;
            self.x = 0;
            self.w = img.width
            self.h = img.width
        else:
            self.x = x;
            self.y = y;
            self.width = width;
            self.height = height;

    def getScaleX(self, r2):
        return max(self.w / r2.w, r2.w / self.w);
    def getScaleY(self, r2):
        return max(self.h / r2.h, r2.h / self.h);

parser = argparse.ArgumentParser(description='.')
parser.add_argument('input_json', type=str, default='comics.json');
parser.add_argument('dir', type=str, default='./dist');

args = parser.parse_args()

class Pro:
    def __init__(self):
        self.rel_dir = args.dir;
        if self.rel_dir != './':
            if self.rel_dir[0] == '.':
                self.rel_dir = self.rel_dir[2:] # Remove beginning './' from relative_dir
        self.json_file_hq = open(self.rel_dir+'/comics_hq.json', 'w');

    def process_page(self):
        img_src = self.page['filename'];
        img_path = '/'.join(img_src.split('/')[:-1]);
        img_name = img_src.split('/')[-1];
        if img_path[0] == '.':
            img_path = img_path[2:] # Remove beginning './' from relative_dir


        hq_path = Path(self.rel_dir + '/' + str(img_path) + '/hq');

        if not hq_path.is_dir():
            print('No hq folder in: ' + str(hq_path) + '\n-- for image: ' + img_name);
            return False;

        hq_src = Path(self.rel_dir + '/' + str(img_path) + '/hq/' + img_name);

        if not hq_src.is_file():
            print('No hq file in: ' + str(hq_src)+ '\n-- for image: ' + img_name);
            return False

        img=Rect(img=Image.open(str(hq_src)));
        p = Rect(img_data=self.page)
        scaleX = p.getScaleX(img);
        #scaleX = min(p.getScaleX(img), p.getScaleY(img));
        #scaleX = p.getScaleX(img);
        #scaleY = p.getScaleY(img);
        self.page['scaleX'] = scaleX;
        self.page['scaleY'] = scaleX;
        self.page['filename_hq'] = str('./' + img_path + '/hq/' + img_name);
        print(scaleX);
        return True;

    def process(self):
        with open(self.rel_dir + '/' + args.input_json, 'r') as json_file:
            self.data = json.load(json_file);
            for name in iter(self.data):
                print(name);
                print('----');
                for chapter in self.data[name]:
                        print(chapter);
                        print('----');
                        for page_num in self.data[name][chapter]:
                                self.page = self.data[name][chapter][page_num];
                                print(page_num);
                                if not self.process_page():
                                        break;
                                self.data[name][chapter][page_num] = self.page;

    def save_json(self):
        print("Saving json:" + self.rel_dir + '/comics_hq.json')
        json.dump(self.data, self.json_file_hq)
        print("end")

pro = Pro();
pro.process();
pro.save_json();

