from setuptools import find_packages, setup

setup(
    name='feda11y',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'Flask==1.1.1'
    ],
)
