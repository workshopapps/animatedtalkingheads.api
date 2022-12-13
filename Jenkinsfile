pipeline {
	agent any
	
	tools {nodejs "nodejs"}
	
	stages {

		stage("Build Backend"){

			steps {
                sh " rm -rf animatedtalkingheads.api"
			    sh "git clone https://github.com/workshopapps/animatedtalkingheads.api.git"
                dir('animatedtalkingheads.api/node-backend') {
                
                    sh "npm install"
                    sh "npm run build"
                    
                }
			} 
	    }
		stage("Deploy Backend"){

			steps {
                
				sh "sudo cp -fr ${WORKSPACE}/animatedtalkingheads.api/node-backend/* /home/omiebi/animatedtalkingheads.api/node-backend/"
				sh "sudo cp -fr ${WORKSPACE}/animatedtalkingheads.api/pyhton-backend/* /home/omiebi/animatedtalkingheads.api/pyhton-backend/"

				sh "sudo systemctl restart voxclips_api.service"
			} 
	    }
		
    }
    post{
        failure{
            emailext attachLog: true, 
            to: 'adetunmbikenny@gmail.com',
            subject: '${BUILD_TAG} Build failed',
            body: '${BUILD_TAG} Build Failed \nMore Info can be found here: ${BUILD_URL} or in the log file below'
        }
    }
}
